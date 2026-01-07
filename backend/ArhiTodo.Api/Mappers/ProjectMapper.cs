using ArhiTodo.Domain.Entities;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;

namespace ArhiTodo.Mappers;

public static class ProjectMapper
{
    public static ProjectGetDto ToGetDto(this Project project)
    {
        return new ProjectGetDto()
        {
            ProjectId = project.ProjectId,
            ProjectName = project.ProjectName,
            Boards = project.Boards.Select(b => b.ToBoardGetDto()).ToList()
        };
    }
}