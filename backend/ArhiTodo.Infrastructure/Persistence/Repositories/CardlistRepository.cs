using ArhiTodo.Domain.Entities;
using ArhiTodo.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class CardlistRepository(ProjectDataBase projectDataBase) : ICardlistRepository
{
    public async Task<CardList?> CreateAsync(CardList cardList)
    {
        EntityEntry<CardList> cardListEntry = projectDataBase.CardLists.Add(cardList);
        await projectDataBase.SaveChangesAsync();
        return cardListEntry.Entity;
    }

    public async Task<bool> DeleteAsync(int cardListId)
    {
        int removedRows = await projectDataBase.CardLists
            .Where(cl => cl.CardListId == cardListId)
            .ExecuteDeleteAsync();
        return removedRows == 1;
    }
}