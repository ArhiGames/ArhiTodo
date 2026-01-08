using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Application.Mappers;

public static class ProjectMapper
{
    public static Project FromPostDto(this ProjectPostDto projectPostDto)
    {
        return new Project
        {
            ProjectName = projectPostDto.ProjectName
        };
    }

    public static ProjectGetDto ToGetDto(this Project project)
    {
        return new ProjectGetDto
        {
            ProjectId = project.ProjectId,
            ProjectName = project.ProjectName
        };
    }
}