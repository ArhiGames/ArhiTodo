using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class ChecklistMapper
{
    public static Checklist FromCreateDto(this ChecklistCreateDto checklistCreateDto, int cardId)
    {
        return new Checklist
        {
            CardId = cardId,
            ChecklistName = checklistCreateDto.ChecklistName
        };
    }

    public static Checklist FromUpdateDto(this ChecklistUpdateDto checklistUpdateDto, int cardId)
    {
        return new Checklist
        {
            ChecklistId = checklistUpdateDto.ChecklistId,
            ChecklistName = checklistUpdateDto.ChecklistName,
            CardId = cardId
        };
    }

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