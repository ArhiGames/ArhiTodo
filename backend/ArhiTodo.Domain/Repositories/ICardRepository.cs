using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories;

public interface ICardRepository
{
    Task<Card?> CreateAsync(Card card);
    Task<bool> DeleteAsync(int cardId);
    Task<bool> PatchCardStatus(int cardId, bool isDone);
    Task<bool> PatchCardName(int cardId, string updatedCardName);
    Task<bool> PatchCardDescription(int cardId, string updatedCardDescription);
    Task<Card?> GetDetailedCard(int cardId, bool includeChecklist = true);
}