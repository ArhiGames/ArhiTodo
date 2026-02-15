using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class ChecklistItemMapper
{
    public static ChecklistItemGetDto ToGetDto(this ChecklistItem checklistItem)
    {
        return new ChecklistItemGetDto
        {
            ChecklistItemId = checklistItem.ChecklistItemId,
            Position = checklistItem.Position,
            ChecklistItemName = checklistItem.ChecklistItemName,
            IsDone = checklistItem.IsDone
        };
    }
}