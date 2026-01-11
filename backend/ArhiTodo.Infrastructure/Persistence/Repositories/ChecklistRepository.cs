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

    public async Task<bool> RemoveChecklistItemFromChecklist(int checklistItemId)
    {
        int changedRows = await database.ChecklistItems
            .Where(ci => ci.ChecklistItemId == checklistItemId)
            .ExecuteDeleteAsync();
        return changedRows == 1;
    }

    async Task<bool> IChecklistRepository.PatchChecklistItemDoneState(int checklistItemId, bool taskDone)
    {
        int changedRows = await database.ChecklistItems
            .Where(ci => ci.ChecklistItemId == checklistItemId)
            .ExecuteUpdateAsync(p => p.SetProperty(ci => ci.IsDone, taskDone));
        return changedRows == 1;
    }
}