using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface ICardRepository
{
    Task<Card?> CreateAsync(Card card);
    Task<bool> DeleteAsync(int cardId);
    Task<Card?> PatchCardStatus(int cardId, bool isDone);
    Task<Card?> PatchCardName(int cardId, string updatedCardName);
    Task<Card?> PatchCardDescription(int cardId, string updatedCardDescription);
    Task<Card?> GetDetailedCard(int cardId, bool includeChecklist = true);
}