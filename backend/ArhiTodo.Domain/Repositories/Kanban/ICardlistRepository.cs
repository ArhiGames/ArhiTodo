using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface ICardlistRepository
{
    Task<CardList?> CreateAsync(CardList cardList);
    Task<CardList?> UpdateAsync(CardList cardList);
    Task<bool> DeleteCardsAsync(int cardListId);
    Task<bool> DeleteAsync(int cardListId);
}