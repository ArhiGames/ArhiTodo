using ArhiTodo.Application.DTOs.Project;

namespace ArhiTodo.Application.Services.Interfaces;

public interface IProjectService
{
    Task<ProjectGetDto> CreateProject(ProjectCreateDto projectCreateDto);
    Task<bool> DeleteProject(int projectId);
    Task<List<ProjectGetDto>> GetProjects();
}