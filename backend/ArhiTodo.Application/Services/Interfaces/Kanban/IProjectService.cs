using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Project;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IProjectService
{
    Task<bool> AddProjectManager(int projectId, Guid userId);
    Task<bool> RemoveProjectManager(int projectId, Guid userId);
    Task<List<UserGetDto>> GetProjectManagers(int projectId);
        
    Task<ProjectGetDto?> CreateProject(ClaimsPrincipal user, ProjectCreateDto projectCreateDto);
    Task<ProjectGetDto?> UpdateProject(ClaimsPrincipal user, ProjectUpdateDto projectUpdateDto);
    Task<bool> DeleteProject(int projectId);
    Task<ProjectGetDto?> GetProject(int projectId);
    Task<List<ProjectGetDto>> GetProjects();
}