using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class CardService(ICardRepository cardRepository, ICardNotificationService cardNotificationService,
    IUnitOfWork unitOfWork) : ICardService
{
    public async Task<CardGetDto?> CreateCard(int boardId, int cardListId, CardCreateDto cardCreateDto)
    {
        Card? card = await cardRepository.CreateAsync(new Card(cardListId, cardCreateDto.CardName));
        if (card == null) return null;

        CardGetDto cardGetDto = card.ToGetDto();
        cardNotificationService.CreateCard(boardId, cardListId, cardGetDto);
        return cardGetDto;
    }

    public async Task<bool> DeleteCard(int projectId, int boardId, int cardId)
    {
        bool succeeded = await cardRepository.DeleteAsync(cardId);
        if (succeeded)
        {
            cardNotificationService.DeleteCard(boardId, cardId);
        }
        return succeeded;
    }

    public async Task<CardGetDto?> PatchCardStatus(int boardId, int cardId, bool isDone)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return null;

        card.UpdateCardState(isDone);
        await unitOfWork.SaveChangesAsync();
        
        CardGetDto cardGetDto = card.ToGetDto();
        cardNotificationService.PathCardStatus(boardId, cardId, cardGetDto.IsDone);
        return cardGetDto;
    }

    public async Task<CardGetDto?> PatchCardName(int boardId, int cardId, PatchCardNameDto patchCardNameDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return null;
        
        card.RenameCard(patchCardNameDto.NewCardName);
        await unitOfWork.SaveChangesAsync();
        
        CardGetDto cardGetDto = card.ToGetDto();
        cardNotificationService.PatchCardName(boardId, cardId, cardGetDto);
        return cardGetDto;
    }

    public async Task<CardGetDto?> PatchCardDescription(int cardId, PatchCardDescriptionDto patchCardDescriptionDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return null;

        card.ChangeCardDescription(patchCardDescriptionDto.NewCardDescription);
        await unitOfWork.SaveChangesAsync();
        
        return card.ToGetDto();
    }

    public async Task<CardGetDto?> GetCard(int cardId)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        return card?.ToGetDto();
    }
}