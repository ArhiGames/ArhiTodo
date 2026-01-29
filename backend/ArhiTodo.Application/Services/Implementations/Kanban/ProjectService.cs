using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ProjectService(IProjectRepository projectRepository, IProjectNotificationService projectNotificationService) : IProjectService
{
    public async Task<ProjectGetDto> CreateProject(ProjectCreateDto projectCreateDto)
    {
        Project project = projectCreateDto.FromCreateDto();
        await projectRepository.CreateAsync(project);
        return project.ToGetDto();
    }

    public async Task<ProjectGetDto?> UpdateProject(ProjectUpdateDto projectUpdateDto)
    {
        Project? project = await projectRepository.UpdateProject(projectUpdateDto.FromUpdateDto());
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