using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IProjectService
{
    Task<Result<List<UserGetDto>>> UpdateProjectManagerStates(int projectId, List<ProjectManagerStatusUpdateDto> projectManagerStatusUpdateDtos);
    Task<Result> RemoveProjectManager(int projectId, Guid projectManagerId);
    Task<Result<List<UserGetDto>>> GetProjectManagers(int projectId);
        
    Task<Result<ProjectGetDto>> CreateProject(ProjectCreateDto projectCreateDto);
    Task<Result<ProjectGetDto>> UpdateProject(ProjectUpdateDto projectUpdateDto);
    Task<Result> DeleteProject(int projectId);
    Task<Result<ProjectGetDto>> GetProject(int projectId);
    Task<Result<List<ProjectGetDto>>> GetProjects();
}