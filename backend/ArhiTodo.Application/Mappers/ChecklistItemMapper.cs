using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class ChecklistItemMapper
{
    public static ChecklistItem FromCreateDto(this ChecklistItemCreateDto checklistItemCreateDto, int checklistId)
    {
        return new ChecklistItem
        {
            ChecklistId = checklistId,
            ChecklistItemName = checklistItemCreateDto.ChecklistItemName
        };
    }

    public static ChecklistItem FromUpdateDto(this ChecklistItemUpdateDto checklistItemUpdateDto, int checklistId)
    {
        return new ChecklistItem
        {
            ChecklistItemId = checklistItemUpdateDto.ChecklistItemId,
            ChecklistItemName = checklistItemUpdateDto.ChecklistItemName,
            IsDone = checklistItemUpdateDto.IsDone,
            ChecklistId = checklistId
        };
    }

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