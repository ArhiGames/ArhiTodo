using ArhiTodo.Domain.Entities;
using ArhiTodo.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class CardRepository(ProjectDataBase projectDataBase) : ICardRepository
{
    public async Task<Card?> CreateAsync(Card card)
    {
        EntityEntry<Card> entityEntry = projectDataBase.Cards.Add(card);
        await projectDataBase.SaveChangesAsync();
        return entityEntry.Entity;
    }

    public async Task<bool> DeleteAsync(int cardId)
    {
        int deletedRows = await projectDataBase.Cards
            .Where(c => c.CardId == cardId)
            .ExecuteDeleteAsync();
        await projectDataBase.SaveChangesAsync();
        return deletedRows == 1;
    }

    public async Task<bool> PatchCardStatus(int cardId, bool isDone)
    {
        int changedCardStates = await projectDataBase.Cards
            .Where(c => c.CardId == cardId)
            .ExecuteUpdateAsync(s => s.SetProperty(c => c.IsDone, isDone));
        return changedCardStates == 1;
    }

    public async Task<bool> PatchCardName(int cardId, string updatedCardName)
    {
        int changedRows = await projectDataBase.Cards
            .Where(c => c.CardId == cardId)
            .ExecuteUpdateAsync(p => p.SetProperty(c => c.CardName, updatedCardName));
        return changedRows == 1;
    }

    public async Task<bool> PatchCardDescription(int cardId, string updatedCardDescription)
    {
        int changedRows = await projectDataBase.Cards
            .Where(c => c.CardId == cardId)
            .ExecuteUpdateAsync(p => p.SetProperty(c => c.CardDescription, updatedCardDescription));
        return changedRows == 1;
    }

    public async Task<Card?> GetDetailedCard(int cardId, bool includeChecklist = true)
    {
        Card? card;
        if (includeChecklist)
        {
            card = await projectDataBase.Cards
                .Include(c => c.CardLabels)
                .Include(c => c.Checklists)
                    .ThenInclude(cl => cl.ChecklistItems)
                .FirstOrDefaultAsync(c => c.CardId == cardId);    
        }
        else
        {
            card = await projectDataBase.Cards
                .Include(c => c.CardLabels)
                .FirstOrDefaultAsync(c => c.CardId == cardId);
        }
        return card;
    }
}