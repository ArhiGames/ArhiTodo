using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Post;

namespace ArhiTodo.Interfaces;

public interface IChecklistRepository
{
    Task<Checklist?> CreateChecklistOnCard(int cardId, ChecklistPostDto checklistPostDto);
    Task<bool> DeleteChecklistFromCard(int cardId, int checkListId);
    Task<ChecklistItem?> AddChecklistItemToChecklist(int checklistId, ChecklistItemPostDto checklistItemPostDto);
    Task<bool> RemoveChecklistItemFromChecklist(int checklistId, int checklistItemId);
}