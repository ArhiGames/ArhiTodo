using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Auth;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ProjectService(IAccountRepository accountRepository, IUnitOfWork unitOfWork, IProjectRepository projectRepository, 
    IProjectNotificationService projectNotificationService, ICurrentUser currentUser) : IProjectService
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
        
        bool succeeded = project.RemoveProjectManager(projectManagerId);
        if (succeeded)
        {
            await unitOfWork.SaveChangesAsync();
        }
        return succeeded;
    }

    public async Task<List<UserGetDto>?> GetProjectManagers(int projectId)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project == null) return null;
        
        List<Guid> userIds = project.ProjectManagers.Select(pm => pm.UserId).ToList();
        List<User> projectManagers = await accountRepository.GetUsersByGuidsAsync(userIds);
        
        return projectManagers.Select(pm => pm.ToGetDto()).ToList();
    }

    public async Task<ProjectGetDto?> CreateProject(ProjectCreateDto projectCreateDto)
    {
        User? foundUser = await accountRepository.GetUserByGuidAsync(currentUser.UserId);
        if (foundUser == null) return null;

        Project project = await projectRepository.CreateAsync(
            new Project(projectCreateDto.ProjectName, foundUser));
        project.AddProjectManager(new ProjectManager(project.ProjectId, foundUser.UserId));
        await unitOfWork.SaveChangesAsync();
        
        return project.ToGetDto();
    }

    public async Task<ProjectGetDto?> UpdateProject(ProjectUpdateDto projectUpdateDto)
    {
        Project? project = await projectRepository.GetAsync(projectUpdateDto.ProjectId);
        if (project == null) return null;

        project.ChangeName(projectUpdateDto.ProjectName);
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