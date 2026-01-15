using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ProjectService(IProjectRepository projectRepository) : IProjectService
{
    public async Task<ProjectGetDto> CreateProject(ProjectCreateDto projectCreateDto)
    {
        Project project = projectCreateDto.FromCreateDto();
        await projectRepository.CreateAsync(project);
        return project.ToGetDto();
    }

    public async Task<bool> DeleteProject(int projectId)
    {
        bool succeeded = await projectRepository.DeleteAsync(projectId);
        return succeeded;
    }

    public async Task<List<ProjectGetDto>> GetProjects()
    {
        List<Project> projects = await projectRepository.GetAllAsync();
        return projects.Select(p => p.ToGetDto()).ToList();
    }
}