using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class ChecklistMapper
{
    public static ChecklistGetDto ToGetDto(this Checklist checklist)
    {
        return new ChecklistGetDto
        {
            ChecklistId = checklist.ChecklistId,
            ChecklistName = checklist.ChecklistName,
            ChecklistItems = checklist.ChecklistItems.Select(ci => ci.ToGetDto()).ToList()
        };
    }
}