using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Domain.Entities;

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

    public static ChecklistItemGetDto ToGetDto(this ChecklistItem checklist)
    {
        return new ChecklistItemGetDto
        {
            ChecklistItemId = checklist.ChecklistId,
            ChecklistItemName = checklist.ChecklistItemName
        };
    }
}