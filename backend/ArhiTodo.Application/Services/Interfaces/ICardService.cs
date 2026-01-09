using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Application.Services.Interfaces;

public interface ICardService
{
    Task<CardGetDto?> CreateCard(int cardListId, CardCreateDto cardCreateDto);
    Task<bool> DeleteCard(int cardId);
    Task<bool> PatchCardStatus(int cardId, bool isDone);
    Task<bool> PatchCardName(int cardId, string updatedCardName);
    Task<bool> PatchCardDescription(int cardId, string updatedCardDescription);
    Task<CardGetDto?> GetCard(int cardId, bool includeChecklist = true);
}