using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

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

    public async Task<Card?> GetDetailedCard(int cardId)
    {
        Card? card = await projectDataBase.Cards
            .Include(c => c.Labels)
            .Include(c => c.Checklists)
                .ThenInclude(cl => cl.ChecklistItems)
            .FirstOrDefaultAsync(c => c.CardId == cardId);    
        return card;
    }

    public async Task<(string? prevLocation, string? nextLocation)> GetPrevNextCards(int cardListId, int location)
    {
        List<Card> cards = await projectDataBase.Cards
            .AsNoTracking()
            .Where(c => c.CardListId == cardListId)
            .OrderBy(c => c.Position)
            .ToListAsync();

        string? prevLocation = location == 0 ? null : cards[location - 1].Position;
        string? nextLocation = cards.Count > location + 1 ? cards[location + 1].Position : null;

        return (prevLocation, nextLocation);
    }

    public async Task<int> GetCardsCount(int cardListId)
    {
        return await projectDataBase.Cards.AsNoTracking().Where(c => c.CardListId == cardListId).CountAsync();
    }
}