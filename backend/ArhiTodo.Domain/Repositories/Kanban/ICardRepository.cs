using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface ICardRepository
{
    Task<Card?> CreateAsync(Card card);
    Task<bool> DeleteAsync(int cardId);
    Task<Card?> GetDetailedCard(int cardId);
}