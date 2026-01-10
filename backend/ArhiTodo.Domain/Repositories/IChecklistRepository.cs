using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Domain.Repositories;

public interface IChecklistRepository
{
    Task<Checklist?> CreateChecklistOnCard(Checklist checklist);
    Task<bool> DeleteChecklistFromCard(int checkListId);
    
    Task<ChecklistItem?> AddChecklistItemToChecklist(ChecklistItem checklistItem);
    Task<bool> RemoveChecklistItemFromChecklist(int checklistItemId);
    Task<bool> PatchChecklistItemDoneState(int checklistItemId, bool taskDone);
}