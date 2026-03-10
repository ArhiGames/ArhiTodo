using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

public class CardRepository(ProjectDataBase database) : ICardRepository
{
    public async Task<Card?> CreateAsync(Card card)
    {
        EntityEntry<Card> entityEntry = database.Cards.Add(card);
        await database.SaveChangesAsync();
        return entityEntry.Entity;
    }

    public async Task<bool> DeleteAsync(int cardId)
    {
        Card? card = await database.Cards.FindAsync(cardId);
        if (card is null) return false;
        EntityEntry<Card> entityEntry = database.Cards.Remove(card);
        
        await database.SaveChangesAsync();
        return entityEntry.State is EntityState.Deleted or EntityState.Detached;
    }

    public async Task<Card?> GetCard(int cardId)
    {
        Card? card = await database.Cards.FindAsync(cardId);    
        return card;
    }

    public async Task<Card?> GetDetailedCard(int cardId)
    {
        Card? card = await database.Cards
            .Include(c => c.AssignedUsers)
            .Include(c => c.Labels)
            .Include(c => c.Checklists)
                .ThenInclude(cl => cl.ChecklistItems)
            .FirstOrDefaultAsync(c => c.CardId == cardId);    
        return card;
    }

    public async Task<List<Card>> GetCardsFromCardList(int cardListId)
    {
        List<Card> cards = await database.Cards
            .Where(c => c.CardListId == cardListId)
            .ToListAsync();
        return cards;
    }

    public async Task RemoveAssignedCardUsersFromBoard(int boardId, List<Guid> userIds)
    {
        await database.AssignedCardUsers
            .Where(acu => acu.Card.CardList.BoardId == boardId && userIds.Contains(acu.UserId))
            .ExecuteDeleteAsync();
        
        List<EntityEntry<AssignedCardUser>> trackedEntries = database.ChangeTracker.Entries<AssignedCardUser>()
            .Where(e => e.Entity.Card.CardList.BoardId == boardId && userIds.Contains(e.Entity.UserId))
            .ToList();

        foreach (EntityEntry<AssignedCardUser> entry in trackedEntries)
        {
            entry.State = EntityState.Detached;
        }
    }

    public async Task RemoveAssignedCardUsersFromProject(int projectId, List<Guid> userIds)
    {
        await database.AssignedCardUsers
            .Where(acu => acu.Card.CardList.Board.ProjectId == projectId && userIds.Contains(acu.UserId))
            .ExecuteDeleteAsync();
        
        List<EntityEntry<AssignedCardUser>> trackedEntries = database.ChangeTracker.Entries<AssignedCardUser>()
            .Where(e => e.Entity.Card.CardList.Board.ProjectId == projectId && userIds.Contains(e.Entity.UserId))
            .ToList();

        foreach (EntityEntry<AssignedCardUser> entry in trackedEntries)
        {
            entry.State = EntityState.Detached;
        }
    }
}