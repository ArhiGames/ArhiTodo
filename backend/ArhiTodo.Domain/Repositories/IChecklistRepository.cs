using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Domain.Repositories;

public interface IChecklistRepository
{
    Task<Checklist?> CreateChecklistOnCard(int cardId, ChecklistPostDto checklistPostDto);
    Task<bool> DeleteChecklistFromCard(int cardId, int checkListId);
    Task<ChecklistItem?> AddChecklistItemToChecklist(int checklistId, ChecklistItemPostDto checklistItemPostDto);
    Task<bool> RemoveChecklistItemFromChecklist(int checklistId, int checklistItemId);
    Task<ChecklistItem?> PatchChecklistItemDoneState(int checklistItemId, bool taskDone);
}