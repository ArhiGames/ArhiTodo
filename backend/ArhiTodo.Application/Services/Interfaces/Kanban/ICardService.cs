using ArhiTodo.Application.DTOs.Card;

namespace ArhiTodo.Application.Services.Interfaces;

public interface ICardService
{
    Task<CardGetDto?> CreateCard(int cardListId, CardCreateDto cardCreateDto);
    Task<bool> DeleteCard(int cardId);
    Task<bool> PatchCardStatus(int cardId, bool isDone);
    Task<bool> PatchCardName(int cardId, PatchCardNameDto patchCardNameDto);
    Task<bool> PatchCardDescription(int cardId, PatchCardDescriptionDto patchCardDescriptionDto);
    Task<CardGetDto?> GetCard(int cardId, bool includeChecklist = true);
}