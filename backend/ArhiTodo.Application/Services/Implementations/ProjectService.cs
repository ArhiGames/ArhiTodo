using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces;
using ArhiTodo.Domain.Entities;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations;

public class ProjectService(IProjectRepository projectRepository) : IProjectService
{
    public async Task<ProjectGetDto> CreateProject(ProjectPostDto projectPostDto)
    {
        Project project = projectPostDto.FromPostDto();
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