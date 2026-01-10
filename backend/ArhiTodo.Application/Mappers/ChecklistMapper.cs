using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Domain.Entities;

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