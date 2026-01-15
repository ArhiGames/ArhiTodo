using ArhiTodo.Domain.Entities.Kanban;
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

    public async Task<Card?> PatchCardStatus(int cardId, bool isDone)
    {
        Card? card = await projectDataBase.Cards.FindAsync(cardId);
        if (card == null) return null;

        card.IsDone = isDone;
        await projectDataBase.SaveChangesAsync();

        return card;
    }

    public async Task<Card?> PatchCardName(int cardId, string updatedCardName)
    {
        Card? card = await projectDataBase.Cards.FindAsync(cardId);
        if (card == null) return null;
        
        card.CardName = updatedCardName;
        await projectDataBase.SaveChangesAsync();
        
        return card;
    }

    public async Task<Card?> PatchCardDescription(int cardId, string updatedCardDescription)
    {
        Card? card = await projectDataBase.Cards.FindAsync(cardId);
        if (card == null) return null;
        
        card.CardDescription = updatedCardDescription;
        await projectDataBase.SaveChangesAsync();
        
        return card;
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