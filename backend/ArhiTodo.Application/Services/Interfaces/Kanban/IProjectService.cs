using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IProjectService
{
    Task<List<UserGetDto>?> UpdateProjectManagerStates(int projectId, List<ProjectManagerStatusUpdateDto> projectManagerStatusUpdateDtos);
    Task<bool> RemoveProjectManager(int projectId, Guid projectManagerId);
    Task<List<UserGetDto>?> GetProjectManagers(int projectId);
        
    Task<Result<ProjectGetDto>> CreateProject(ProjectCreateDto projectCreateDto);
    Task<Result<ProjectGetDto>> UpdateProject(ProjectUpdateDto projectUpdateDto);
    Task<bool> DeleteProject(int projectId);
    Task<ProjectGetDto?> GetProject(int projectId);
    Task<List<ProjectGetDto>> GetProjects();
}