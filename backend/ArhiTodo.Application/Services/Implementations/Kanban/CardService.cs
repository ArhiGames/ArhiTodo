using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations;

public class CardService(ICardRepository cardRepository) : ICardService
{
    public async Task<CardGetDto?> CreateCard(int cardListId, CardCreateDto cardCreateDto)
    {
        Card? card = await cardRepository.CreateAsync(cardCreateDto.FromCreateDto(cardListId));
        return card?.ToGetDto();
    }

    public async Task<bool> DeleteCard(int cardId)
    {
        bool succeeded = await cardRepository.DeleteAsync(cardId);
        return succeeded;
    }

    public async Task<bool> PatchCardStatus(int cardId, bool isDone)
    {
        bool succeeded = await cardRepository.PatchCardStatus(cardId, isDone);
        return succeeded;
    }

    public async Task<bool> PatchCardName(int cardId, string updatedCardName)
    {
        bool succeeded = await cardRepository.PatchCardName(cardId, updatedCardName);
        return succeeded;
    }

    public async Task<bool> PatchCardDescription(int cardId, string updatedCardDescription)
    {
        bool succeeded = await cardRepository.PatchCardDescription(cardId, updatedCardDescription);
        return succeeded;
    }

    public async Task<CardGetDto?> GetCard(int cardId, bool includeChecklist = true)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId, includeChecklist);
        return card?.ToGetDto();
    }
}