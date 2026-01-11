using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories;

public interface ICardlistRepository
{
    Task<CardList?> CreateAsync(CardList cardList);
    Task<bool> DeleteAsync(int cardListId);
}