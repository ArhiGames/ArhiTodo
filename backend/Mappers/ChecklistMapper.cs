using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Post;

namespace ArhiTodo.Mappers;

public static class ChecklistMapper
{
    public static Checklist FromChecklistPostDto(this ChecklistPostDto checklistPostDto)
    {
        return new Checklist()
        {
            ChecklistName = checklistPostDto.ChecklistName
        };
    }

    public static ChecklistItem FromChecklistItemPostDto(this ChecklistItemPostDto checklistItemPostDto)
    {
        return new ChecklistItem()
        {
            ChecklistItemName = checklistItemPostDto.ChecklistItemName
        };
    }

    public static ChecklistGetDto ToChecklistGetDto(this Checklist checklist)
    {
        return new ChecklistGetDto()
        {
            ChecklistId = checklist.ChecklistId,
            ChecklistName = checklist.ChecklistName,
            ChecklistItems = checklist.ChecklistItems.Select(ci => ci.ToChecklistItemGetDto()).ToList()
        };
    }

    public static ChecklistItemGetDto ToChecklistItemGetDto(this ChecklistItem checklistItem)
    {
        return new ChecklistItemGetDto()
        {
            ChecklistItemId = checklistItem.ChecklistItemId,
            ChecklistItemName = checklistItem.ChecklistItemName,
            IsDone = checklistItem.IsDone
        };
    }
}