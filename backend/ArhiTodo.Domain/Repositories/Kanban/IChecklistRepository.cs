using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IChecklistRepository
{
    Task<Checklist?> CreateChecklistOnCard(Checklist checklist);
    Task<Checklist?> UpdateChecklist(Checklist checklist);
    Task<bool> DeleteChecklistFromCard(int checkListId);
    
    Task<ChecklistItem?> AddChecklistItemToChecklist(ChecklistItem checklistItem);
    Task<ChecklistItem?> UpdateChecklistItem(ChecklistItem checklistItem);
    Task<bool> RemoveChecklistItemFromChecklist(int checklistItemId);
    Task<ChecklistItem?> PatchChecklistItemDoneState(int checklistItemId, bool taskDone);
}