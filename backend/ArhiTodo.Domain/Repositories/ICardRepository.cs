using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Domain.Repositories;

public interface ICardRepository
{
    Task<Card?> CreateAsync(int cardListId, CardPostDto cardPostDto);
    Task<bool> DeleteAsync(int cardId);
    Task<Card?> PatchCardStatus(int cardId, bool isDone);
    Task<Card?> PatchCardName(int cardId, PatchCardNameDto patchCardNameDto);
    Task<Card?> PatchCardDescription(int cardId, PatchCardDescriptionDto patchCardDescriptionDto);
    Task<DetailedCardGetDto?> GetDetailedCard(int cardId);
}