using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

public class LabelRepository(ProjectDataBase database) : ILabelRepository
{
    public async Task<Label?> CreateLabelAsync(Label label)
    {
        EntityEntry<Label> labelEntry = database.Labels.Add(label);
        await database.SaveChangesAsync();
        return labelEntry.Entity;
    }

    public async Task<bool> DeleteLabelAsync(int labelId)
    {
        int removedRows = await database.Labels
            .Where(l => l.LabelId == labelId)
            .ExecuteDeleteAsync();
        return removedRows == 1;
    }

    public async Task<List<Label>> GetAllAsync(int boardId)
    {
        List<Label> labels = await database.Labels
            .Where(l => l.BoardId == boardId)
            .ToListAsync();
        return labels;
    }
}