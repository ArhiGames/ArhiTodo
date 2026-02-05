using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class ProjectMapper
{
    public static ProjectGetDto ToGetDto(this Project project)
    {
        return new ProjectGetDto
        {
            ProjectId = project.ProjectId,
            ProjectName = project.ProjectName,
            OwnedByUserId = project.OwnedByUserId,
            Boards = project.Boards.Select(b => b.ToGetDto()).ToList()
        };
    }
}