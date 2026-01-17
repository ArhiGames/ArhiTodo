using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class ChecklistRepository(ProjectDataBase database) : IChecklistRepository
{
    public async Task<Checklist?> CreateChecklistOnCard(Checklist checklist)
    {
        EntityEntry<Checklist> checklistEntry = database.Checklists.Add(checklist);
        await database.SaveChangesAsync();
        return checklistEntry.Entity;
    }

    public async Task<Checklist?> UpdateChecklist(Checklist checklist)
    {
        Checklist? foundChecklist = await database.Checklists.FindAsync(checklist.ChecklistId);
        if (foundChecklist == null) return null;

        foundChecklist.ChecklistName = checklist.ChecklistName;

        await database.SaveChangesAsync();
        return foundChecklist;
    }

    public async Task<bool> DeleteChecklistFromCard(int checkListId)
    {
        int changedRows = await database.Checklists
            .Where(cl => cl.ChecklistId == checkListId)
            .ExecuteDeleteAsync();
        return changedRows == 1;
    }

    public async Task<ChecklistItem?> AddChecklistItemToChecklist(ChecklistItem checklistItem)
    {
        EntityEntry<ChecklistItem> checklistItemEntry = database.ChecklistItems.Add(checklistItem);
        await database.SaveChangesAsync();
        return checklistItemEntry.Entity;
    }

    public async Task<ChecklistItem?> UpdateChecklistItem(ChecklistItem checklistItem)
    {
        ChecklistItem? foundChecklistItem = await database.ChecklistItems.FindAsync(checklistItem.ChecklistItemId);
        if (foundChecklistItem == null) return null;

        foundChecklistItem.ChecklistItemName = checklistItem.ChecklistItemName;
        foundChecklistItem.IsDone = checklistItem.IsDone;

        await database.SaveChangesAsync();
        return foundChecklistItem;
    }

    public async Task<bool> RemoveChecklistItemFromChecklist(int checklistItemId)
    {
        int changedRows = await database.ChecklistItems
            .Where(ci => ci.ChecklistItemId == checklistItemId)
            .ExecuteDeleteAsync();
        return changedRows == 1;
    }

    public async Task<ChecklistItem?> PatchChecklistItemDoneState(int checklistItemId, bool taskDone)
    {
        ChecklistItem? checklistItem = await database.ChecklistItems.FindAsync(checklistItemId);
        if (checklistItem == null) return null;

        checklistItem.IsDone = taskDone;
        await database.SaveChangesAsync();
        
        return checklistItem;
    }
}