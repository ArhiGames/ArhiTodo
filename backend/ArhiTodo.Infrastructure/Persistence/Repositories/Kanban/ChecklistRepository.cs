using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

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
}