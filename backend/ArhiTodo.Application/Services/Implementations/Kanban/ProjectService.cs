using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Authorization;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Auth;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ProjectService(IAccountRepository accountRepository, IUnitOfWork unitOfWork, IProjectRepository projectRepository, 
    IProjectNotificationService projectNotificationService, ICurrentUser currentUser, IAuthorizationService authorizationService) : IProjectService
{
    public async Task<List<UserGetDto>?> UpdateProjectManagerStates(int projectId, List<ProjectManagerStatusUpdateDto> projectManagerStatusUpdateDtos)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project == null) return null;
        
        foreach (ProjectManagerStatusUpdateDto projectManagerStatusUpdateDto in projectManagerStatusUpdateDtos)
        {
            if (projectManagerStatusUpdateDto.NewManagerState)
            {
                project.AddProjectManager(new ProjectManager(projectId, projectManagerStatusUpdateDto.UserId));
            }
            else
            {
                project.RemoveProjectManager(projectManagerStatusUpdateDto.UserId);
            }
        }

        await unitOfWork.SaveChangesAsync();
        return await GetProjectManagers(projectId);
    }

    public async Task<bool> RemoveProjectManager(int projectId, Guid projectManagerId)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project == null) return false;
        
        Result removeProjectManagerResult = project.RemoveProjectManager(projectManagerId);
        if (removeProjectManagerResult.IsSuccess)
        {
            await unitOfWork.SaveChangesAsync();
        }
        return removeProjectManagerResult.IsSuccess;
    }

    public async Task<List<UserGetDto>?> GetProjectManagers(int projectId)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project == null) return null;
        
        List<Guid> userIds = project.ProjectManagers.Select(pm => pm.UserId).ToList();
        List<User> projectManagers = await accountRepository.GetUsersByGuidsAsync(userIds);
        
        return projectManagers.Select(pm => pm.ToGetDto()).ToList();
    }

    public async Task<Result<ProjectGetDto>> CreateProject(ProjectCreateDto projectCreateDto)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.CreateProjects));
        if (!authorized) return Errors.Forbidden;
        
        User? foundUser = await accountRepository.GetUserByGuidAsync(currentUser.UserId);
        if (foundUser == null) return Errors.Unauthenticated;

        Result<Project> project = Project.Create(projectCreateDto.ProjectName, foundUser);
        if (!project.IsSuccess) return project.Error!;

        Project createdProject = await projectRepository.CreateAsync(project.Value!);
        createdProject.AddProjectManager(new ProjectManager(createdProject.ProjectId, foundUser.UserId));
        await unitOfWork.SaveChangesAsync();
        
        return project.Value?.ToGetDto()!;
    }

    public async Task<Result<ProjectGetDto>> UpdateProject(ProjectUpdateDto projectUpdateDto)
    {
        Project? project = await projectRepository.GetAsync(projectUpdateDto.ProjectId);
        if (project == null) return Errors.NotFound;

        Result changeNameResult = project.ChangeName(projectUpdateDto.ProjectName);
        if (!changeNameResult.IsSuccess) return changeNameResult.Error!;
        await unitOfWork.SaveChangesAsync();
        
        ProjectGetDto projectGetDto = project.ToGetDto();
        projectNotificationService.UpdateProject(projectGetDto);
        return projectGetDto;
    }

    public async Task<bool> DeleteProject(int projectId)
    {
        bool succeeded = await projectRepository.DeleteAsync(projectId);
        if (succeeded)
        {
            projectNotificationService.DeleteProject(projectId);
        }
        return succeeded;
    }

    public async Task<ProjectGetDto?> GetProject(int projectId)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        return project?.ToGetDto();
    }

    public async Task<List<ProjectGetDto>> GetProjects()
    {
        List<Project> projects = await projectRepository.GetAllAsync();
        return projects.Select(p => p.ToGetDto()).ToList();
    }
}