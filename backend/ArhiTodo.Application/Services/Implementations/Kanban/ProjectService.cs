using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ProjectService(IProjectRepository projectRepository, IProjectNotificationService projectNotificationService) : IProjectService
{
    public async Task<bool> AddProjectManager(int projectId, Guid userId)
    {
        await projectRepository.AddProjectManager(new ProjectManager { ProjectId = projectId, UserId = userId });
        return true;
    }

    public async Task<bool> RemoveProjectManager(int projectId, Guid userId)
    {
        bool succeeeded = await projectRepository.RemoveProjectManager(projectId, userId);
        return succeeeded;
    }

    public async Task<List<UserGetDto>> GetProjectManagers(int projectId)
    {
        List<User> projectManagers = await projectRepository.GetProjectManagers(projectId);
        return projectManagers.Select(pm => pm.ToGetDto()).ToList();
    }

    public async Task<ProjectGetDto?> CreateProject(ClaimsPrincipal user, ProjectCreateDto projectCreateDto)
    {
        Claim? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return null;
        Guid userId = Guid.Parse(userIdClaim.Value);
        
        Project project = projectCreateDto.FromCreateDto(userId);
        await projectRepository.CreateAsync(project);

        await AddProjectManager(project.ProjectId, userId);
        
        return project.ToGetDto();
    }

    public async Task<ProjectGetDto?> UpdateProject(ClaimsPrincipal user, ProjectUpdateDto projectUpdateDto)
    {
        Claim? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return null;
        Guid userId = Guid.Parse(userIdClaim.Value);
        
        Project? project = await projectRepository.UpdateProject(projectUpdateDto.FromUpdateDto(userId));
        if (project == null) return null;

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