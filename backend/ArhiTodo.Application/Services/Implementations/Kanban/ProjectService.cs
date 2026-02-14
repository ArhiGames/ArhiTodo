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
    public async Task<Result<List<UserGetDto>>> UpdateProjectManagerStates(int projectId, List<ProjectManagerStatusUpdateDto> projectManagerStatusUpdateDtos)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project is null) return Errors.NotFound;

        bool mayManageProjectsGlobally = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        if (project.OwnerId != currentUser.UserId && !mayManageProjectsGlobally)
        {
            return new Error("UpdateProjectManagers", ErrorType.Forbidden, "Only the project owner can edit the project managers!");
        }
        
        foreach (ProjectManagerStatusUpdateDto projectManagerStatusUpdateDto in projectManagerStatusUpdateDtos)
        {
            if (projectManagerStatusUpdateDto.NewManagerState)
            {
                Result addProjectManagerResult = project.AddProjectManager(projectManagerStatusUpdateDto.UserId);
                if (!addProjectManagerResult.IsSuccess) return addProjectManagerResult.Error!;
            }
            else
            {
                Result removeProjectManagerResult = project.RemoveProjectManager(projectManagerStatusUpdateDto.UserId);
                if (!removeProjectManagerResult.IsSuccess) return removeProjectManagerResult.Error!;
            }
        }

        await unitOfWork.SaveChangesAsync();

        foreach (ProjectManagerStatusUpdateDto projectManagerStatusUpdateDto in projectManagerStatusUpdateDtos)
        {
            projectNotificationService.UpdateProjectManagerState(projectManagerStatusUpdateDto.UserId, projectId, projectManagerStatusUpdateDto.NewManagerState);
        }
        
        return await GetProjectManagers(project);
    }

    public async Task<Result<List<UserGetDto>>> GetProjectManagers(int projectId)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project is null) return Errors.NotFound;
        
        bool mayManageProjectsGlobally = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        if (!project.IsProjectMember(currentUser.UserId) && !mayManageProjectsGlobally)
        {
            return new Error("GetProjectManagers", ErrorType.Forbidden, 
                "Only the project owner and project managers can retrieve the project managers!");
        }
        
        return await GetProjectManagers(project);
    }

    public async Task<Result<ProjectPermission>> GetUserPermission(int projectId)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project is null) return Errors.NotFound;

        bool isProjectManager = project.IsProjectMember(currentUser.UserId);
        return isProjectManager ? ProjectPermission.Manager : ProjectPermission.None;
    }

    private async Task<List<UserGetDto>> GetProjectManagers(Project project)
    {
        List<Guid> userIds = project.ProjectManagers.Select(pm => pm.UserId).ToList();
        List<User> projectManagers = await accountRepository.GetUsersByGuidsAsync(userIds);
        return projectManagers.Select(pm => pm.ToGetDto()).ToList();
    }

    public async Task<Result<ProjectGetDto>> CreateProject(ProjectCreateDto projectCreateDto)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.CreateProjects));
        if (!authorized) return Errors.Forbidden;
        
        User? foundUser = await accountRepository.GetUserByGuidAsync(currentUser.UserId);
        if (foundUser is null) return Errors.Unauthenticated;

        Result<Project> project = Project.Create(projectCreateDto.ProjectName, foundUser);
        if (!project.IsSuccess) return project.Error!;

        Project createdProject = await projectRepository.CreateAsync(project.Value!);
        createdProject.AddProjectManager(foundUser.UserId);
        await unitOfWork.SaveChangesAsync();
        
        return createdProject.ToGetDto();
    }

    public async Task<Result<ProjectGetDto>> UpdateProject(ProjectUpdateDto projectUpdateDto)
    {
        Project? project = await projectRepository.GetAsync(projectUpdateDto.ProjectId);
        if (project is null) return Errors.NotFound;

        bool mayManageProjectsGlobally = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        if (!mayManageProjectsGlobally)
        {
            bool isProjectManager = project.IsProjectMember(currentUser.UserId);
            if (project.OwnerId != currentUser.UserId && !isProjectManager)
            {
                return new Error("UpdateProjectManagers", ErrorType.Forbidden, "Only project managers can update the project!");
            }            
        }

        Result changeNameResult = project.ChangeName(projectUpdateDto.ProjectName);
        if (!changeNameResult.IsSuccess) return changeNameResult.Error!;
        await unitOfWork.SaveChangesAsync();
        
        ProjectGetDto projectGetDto = project.ToGetDto();
        projectNotificationService.UpdateProject(projectGetDto);
        return projectGetDto;
    }

    public async Task<Result> DeleteProject(int projectId)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project is null) return Errors.NotFound;
        
        bool mayDeleteProjectsGlobally = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        if (project.OwnerId != currentUser.UserId && !mayDeleteProjectsGlobally)
        {
            return new Error("DeleteProject", ErrorType.Forbidden, "Only the project owner can delete projects!");
        }
        
        await projectRepository.RemoveAsync(project);
        projectNotificationService.DeleteProject(projectId);
        return Result.Success();
    }

    public async Task<Result<ProjectGetDto>> GetProject(int projectId)
    {
        bool mayManageProjectsGlobally = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        if (mayManageProjectsGlobally)
        {
            Project? project = await projectRepository.GetAsync(projectId);
            return project is null ? Errors.NotFound : project.ToGetDto();
        }

        Project? checkedProject = await projectRepository.GetAsync(projectId, currentUser.UserId);
        if (checkedProject is null) return Errors.NotFound;
        return checkedProject.ToGetDto();
    }

    public async Task<Result<List<ProjectGetDto>>> GetProjects()
    {
        bool mayManageProjectsGlobally =
            await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        
        List<Project> projects;
        if (mayManageProjectsGlobally)
        {
            projects = await projectRepository.GetAllAsync();
        }
        else
        {
            projects = await projectRepository.GetAllAsync(currentUser.UserId);
        }
        
        return projects.Select(p => p.ToGetDto()).ToList();
    }
}