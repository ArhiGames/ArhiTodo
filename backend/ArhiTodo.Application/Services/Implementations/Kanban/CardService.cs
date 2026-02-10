using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class CardService(ICardRepository cardRepository, ICardNotificationService cardNotificationService,
    IUnitOfWork unitOfWork) : ICardService
{
    public async Task<Result<CardGetDto>> CreateCard(int boardId, int cardListId, CardCreateDto cardCreateDto)
    {
        Result<Card> createCardResult = Card.Create(cardListId, cardCreateDto.CardName);
        if (!createCardResult.IsSuccess) return createCardResult.Error!;
        
        Card? card = await cardRepository.CreateAsync(createCardResult.Value!);
        if (card == null) return Errors.Unknown;

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
    
    public async Task<Result<CardGetDto>> PatchCardName(int boardId, int cardId, PatchCardNameDto patchCardNameDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return Errors.NotFound;
            
        Result renameCardResult = card.RenameCard(patchCardNameDto.NewCardName);
        if (!renameCardResult.IsSuccess) return renameCardResult.Error!;
        await unitOfWork.SaveChangesAsync();
        
        CardGetDto cardGetDto = card.ToGetDto();
        cardNotificationService.PatchCardName(boardId, cardId, cardGetDto);
        return cardGetDto;
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