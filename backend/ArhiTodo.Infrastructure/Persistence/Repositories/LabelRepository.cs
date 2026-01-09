using ArhiTodo.Domain.Entities;
using ArhiTodo.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class LabelRepository(ProjectDataBase database) : ILabelRepository
{
    public async Task<Label?> CreateLabelAsync(Label label)
    {
        EntityEntry<Label> labelEntry = database.Labels.Add(label);
        await database.SaveChangesAsync();
        return labelEntry.Entity;
    }

    public async Task<bool> UpdateLabelAsync(int labelId, string? labelText, int? labelColor)
    {
        int changedRows = 0;
        if (labelText != null && labelColor != null)
        {
            changedRows = await database.Labels
                .Where(l => l.LabelId == labelId)
                .ExecuteUpdateAsync(
                    p => p.SetProperty(l => labelText, labelText).SetProperty(l => l.LabelColor, labelColor));
        }
        else if (labelText != null)
        {
            changedRows = await database.Labels
                .Where(l => l.LabelId == labelId)
                .ExecuteUpdateAsync(p => p.SetProperty(l => labelText, labelText));
        }
        else if (labelColor != null)
        {
            changedRows = await database.Labels
                .Where(l => l.LabelId == labelId)
                .ExecuteUpdateAsync(p => p.SetProperty(l => l.LabelColor, labelColor));
        }
        else
        {
            throw new ApplicationException("Unhandled label state");
        }

        return changedRows == 1;
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

    public async Task<CardLabel?> AddLabelToCard(int cardId, int labelId)
    {
        CardLabel cardLabel = new()
        {
            CardId = cardId,
            LabelId = labelId
        };
        
        EntityEntry<CardLabel> cardLabelEntry = database.CardLabels.Add(cardLabel);
        await database.SaveChangesAsync();
        return cardLabelEntry.Entity;
    }

    public async Task<bool> RemoveLabelFromCard(int cardId, int labelId)
    {
        int removedRows = await database.CardLabels
            .Where(cl => cl.CardId == cardId && cl.LabelId == labelId)
            .ExecuteDeleteAsync();
        return removedRows == 1;
    }
}