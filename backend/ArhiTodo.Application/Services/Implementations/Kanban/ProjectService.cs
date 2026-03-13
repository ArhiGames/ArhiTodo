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
using ArhiTodo.Domain.Repositories.Authentication;
using ArhiTodo.Domain.Repositories.Authorization;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;
using ArhiTodo.Domain.Services.Auth;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ProjectService(IAccountRepository accountRepository, IUnitOfWork unitOfWork, IProjectRepository projectRepository, 
    IProjectNotificationService projectNotificationService, ICurrentUser currentUser, IAuthorizationService authorizationService,
    IProjectAuthorizer projectAuthorizer, ICardRepository cardRepository, IPasswordHashService passwordHashService) : IProjectService
{
    public async Task<Result> MakeProjectOwner(int projectId, Guid userId, RequiredPasswordActionDto requiredPasswordActionDto)
    {
        User? user = await accountRepository.GetUserByGuidAsync(currentUser.UserId);
        if (user is null) return Errors.Unauthenticated;

        bool passwordVerified = passwordHashService.Verify(requiredPasswordActionDto.Password, user.HashedPassword);
        if (!passwordVerified) return Errors.Forbidden;
        
        Project? project = await projectRepository.GetAsync(projectId);
        if (project is null) return Errors.NotFound;

        if (project.OwnerId != currentUser.UserId)
        {
            return new Error("BeOwnerToEditOwner", ErrorType.Forbidden, "You have be the owner to make other's the owner!");
        }

        Result updateProjectOwnerResult = project.UpdateProjectOwner(userId);
        await unitOfWork.SaveChangesAsync();

        return updateProjectOwnerResult;
    }

    public async Task<Result<List<PublicUserGetDto>>> UpdateProjectManagerStates(int projectId, List<ProjectManagerStatusUpdateDto> projectManagerStatusUpdateDtos)
    {
        if (projectManagerStatusUpdateDtos.Any(pm => pm.UserId == currentUser.UserId))
        {
            return new Error("SelfEditing", ErrorType.Forbidden,
                "You cannot edit your own claims!");
        }
        
        Project? project = await projectRepository.GetAsync(projectId);
        if (project is null) return Errors.NotFound;

        if (project.OwnerId != currentUser.UserId)
        {
            return new Error("UpdateProjectManagers", ErrorType.Forbidden, "Only the project owner can edit the project managers!");
        }

        List<Guid> addingUserIds = projectManagerStatusUpdateDtos.Where(pm => pm.NewManagerState)
            .Select(pm => pm.UserId).ToList();
        List<Guid> removingUserIds = projectManagerStatusUpdateDtos.Where(pm => !pm.NewManagerState)
            .Select(pm => pm.UserId).ToList();
        
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
        await cardRepository.RemoveAssignedCardUsersFromProject(projectId, removingUserIds);

        List<User> addingUsers = await accountRepository.GetUsersByGuidsAsync(addingUserIds);

        foreach (ProjectManagerStatusUpdateDto projectManagerStatusUpdateDto in projectManagerStatusUpdateDtos)
        {
            if (projectManagerStatusUpdateDto.NewManagerState)
            {
                projectNotificationService.AddProjectManager(projectId, 
                    addingUsers.FirstOrDefault(au => au.UserId == projectManagerStatusUpdateDto.UserId)!.ToPublicGetDto());
            }
            else
            {
                projectNotificationService.RemoveProjectManager(projectId, projectManagerStatusUpdateDto.UserId);
            }
        }
        
        return await GetProjectManagers(project);
    }

    public async Task<Result<List<PublicUserGetDto>>> GetProjectManagers(int projectId)
    {
        bool mayViewProject = await projectAuthorizer.HasViewProjectPermissions(projectId);
        if (!mayViewProject) return Errors.Forbidden;
        
        Project? project = await projectRepository.GetAsync(projectId);
        if (project is null) return Errors.NotFound;
        
        return await GetProjectManagers(project);
    }

    public async Task<Result<ProjectPermission>> GetUserPermission(int projectId)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project is null) return Errors.NotFound;

        bool isProjectManager = project.IsProjectMember(currentUser.UserId);
        return isProjectManager ? ProjectPermission.Manager : ProjectPermission.None;
    }

    private async Task<List<PublicUserGetDto>> GetProjectManagers(Project project)
    {
        List<Guid> userIds = project.ProjectManagers.Select(pm => pm.UserId).ToList();
        List<User> projectManagers = await accountRepository.GetUsersByGuidsAsync(userIds);
        return projectManagers.Select(pm => pm.ToPublicGetDto()).ToList();
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

        bool isProjectManager = project.IsProjectMember(currentUser.UserId);
        if (project.OwnerId != currentUser.UserId && !isProjectManager)
        {
            return new Error("UpdateProjectManagers", ErrorType.Forbidden, "Only project managers can update the project!");
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
        
        if (project.OwnerId != currentUser.UserId)
        {
            return new Error("DeleteProject", ErrorType.Forbidden, "Only the project owner can delete projects!");
        }
        
        await projectRepository.RemoveAsync(project);
        projectNotificationService.DeleteProject(projectId);
        return Result.Success();
    }

    public async Task<Result<ProjectGetDto>> GetProject(int projectId)
    {
        bool mayViewProject = await projectAuthorizer.HasViewProjectPermissions(projectId);
        if (!mayViewProject) return Errors.Forbidden;
        
        Project? checkedProject = await projectRepository.GetAsync(projectId);
        if (checkedProject is null) return Errors.NotFound;
        return checkedProject.ToGetDto();
    }

    public async Task<Result<List<ProjectGetDto>>> GetProjects()
    {
        List<Project> projects = await projectRepository.GetAllAsync(currentUser.UserId);
        return projects.Select(p => p.ToGetDto()).ToList();
    }
}