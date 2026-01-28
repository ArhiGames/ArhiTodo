using ArhiTodo.Application.DTOs.Project;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IProjectService
{
    Task<ProjectGetDto> CreateProject(ProjectCreateDto projectCreateDto);
    Task<ProjectGetDto?> UpdateProject(ProjectUpdateDto projectUpdateDto);
    Task<bool> DeleteProject(int projectId);
    Task<ProjectGetDto?> GetProject(int projectId);
    Task<List<ProjectGetDto>> GetProjects();
}