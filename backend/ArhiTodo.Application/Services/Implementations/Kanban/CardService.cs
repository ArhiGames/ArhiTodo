using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

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

    public async Task<CardGetDto?> PatchCardStatus(int cardId, bool isDone)
    {
        Card? card = await cardRepository.PatchCardStatus(cardId, isDone);
        return card?.ToGetDto();
    }

    public async Task<CardGetDto?> PatchCardName(int cardId, PatchCardNameDto patchCardNameDto)
    {
        Card? card = await cardRepository.PatchCardName(cardId, patchCardNameDto.NewCardName);
        return card?.ToGetDto();
    }

    public async Task<CardGetDto?> PatchCardDescription(int cardId, PatchCardDescriptionDto patchCardDescriptionDto)
    {
        Card? card = await cardRepository.PatchCardDescription(cardId, patchCardDescriptionDto.NewCardDescription);
        return card?.ToGetDto();
    }

    public async Task<CardGetDto?> GetCard(int cardId, bool includeChecklist = true)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId, includeChecklist);
        return card?.ToGetDto();
    }
}