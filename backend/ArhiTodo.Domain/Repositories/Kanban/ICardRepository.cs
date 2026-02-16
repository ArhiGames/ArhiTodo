using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface ICardRepository
{
    Task<Card?> CreateAsync(Card card);
    Task<bool> DeleteAsync(int cardId);
    Task<Card?> GetDetailedCard(int cardId);
    Task<(string? prevLocation, string? nextLocation)> GetPrevNextCards(int cardListId, int location);
    Task<int> GetCardsCount(int cardListId);
}