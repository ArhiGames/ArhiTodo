using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class ChecklistItemMapper
{
    public static ChecklistItemGetDto ToGetDto(this ChecklistItem checklistItem)
    {
        return new ChecklistItemGetDto
        {
            ChecklistItemId = checklistItem.ChecklistItemId,
            ChecklistItemName = checklistItem.ChecklistItemName,
            IsDone = checklistItem.IsDone
        };
    }
}