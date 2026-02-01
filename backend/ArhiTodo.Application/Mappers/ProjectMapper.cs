using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class ProjectMapper
{
    public static Project FromCreateDto(this ProjectCreateDto projectCreateDto, Guid createdBy)
    {
        return new Project
        {
            CreatedBy = createdBy,
            ProjectName = projectCreateDto.ProjectName
        };
    }

    public static Project FromUpdateDto(this ProjectUpdateDto projectUpdateDto, Guid createdBy)
    {
        return new Project
        {
            CreatedBy = createdBy,
            ProjectId = projectUpdateDto.ProjectId,
            ProjectName = projectUpdateDto.ProjectName
        };
    }

    public static ProjectGetDto ToGetDto(this Project project)
    {
        return new ProjectGetDto
        {
            ProjectId = project.ProjectId,
            ProjectName = project.ProjectName,
            Boards = project.Boards.Select(b => b.ToGetDto()).ToList()
        };
    }
}