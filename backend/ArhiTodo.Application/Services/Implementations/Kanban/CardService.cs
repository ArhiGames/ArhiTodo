using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Application.Helpers;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Authentication;
using ArhiTodo.Domain.Repositories.Authorization;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class CardService(ICardRepository cardRepository, ICardNotificationService cardNotificationService,
    IUnitOfWork unitOfWork, ICardAuthorizer cardAuthorizer, IAccountRepository accountRepository) : ICardService
{
    public async Task<Result<CardGetDto>> CreateCard(int boardId, int cardListId, CardCreateDto cardCreateDto)
    {
        bool hasCreateCardPermission = await cardAuthorizer.HasCreateCardPermission(cardListId);
        if (!hasCreateCardPermission) return Errors.Forbidden;

        List<Card> cards = await cardRepository.GetCardsFromCardList(cardListId);
        cards = cards.OrderBy(c => c.Position).ToList();
        
        Result<Card> createCardResult = Card.Create(cardListId, cardCreateDto.CardName, cards.Count > 0 ? cards.Last().Position : null);
        if (!createCardResult.IsSuccess) return createCardResult.Error!;
        
        Card? card = await cardRepository.CreateAsync(createCardResult.Value!);
        if (card == null) return Errors.Unknown;

        CardGetDto cardGetDto = card.ToGetDto();
        cardNotificationService.CreateCard(boardId, cardListId, cardGetDto);
        return cardGetDto;
    }

    public async Task<Result> DeleteCard(int boardId, int cardId)
    {
        bool hasDeleteCardPermission = await cardAuthorizer.HasDeleteCardPermission(cardId);
        if (!hasDeleteCardPermission) return Errors.Forbidden;
        
        bool succeeded = await cardRepository.DeleteAsync(cardId);
        if (succeeded)
        {
            cardNotificationService.DeleteCard(boardId, cardId);
        }
        return succeeded ? Result.Success() : Errors.Unknown;
    }

    public async Task<Result> MoveCard(int boardId, int cardId, MoveCardPatchDto moveCardPatchDto)
    {
        bool hasEditCardPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasEditCardPermission) return Errors.Forbidden;

        Card? card = await cardRepository.GetCard(cardId);
        if (card is null) return Errors.NotFound;
        
        List<Card> cards = await cardRepository.GetCardsFromCardList(moveCardPatchDto.CardListId);
        (string? prevLocation, string? nextLocation) = DraggableHelper.GetPrevNextLocation(cards.Cast<Draggable>().ToList(), card, 
            moveCardPatchDto.Location, card.CardListId != moveCardPatchDto.CardListId);

        Result moveCardResult = card.MoveCard(moveCardPatchDto.CardListId, prevLocation, nextLocation);
        await unitOfWork.SaveChangesAsync();

        cardNotificationService.MoveCard(boardId, cardId, moveCardPatchDto.CardListId, moveCardPatchDto.Location);

        return moveCardResult;
    }

    public async Task<Result> UpdateCardUrgency(int boardId, int cardId, int urgencyLevel)
    {
        bool isValidUrgencyLevel = Enum.IsDefined(typeof(CardUrgencyLevel), urgencyLevel);
        if (!isValidUrgencyLevel)
        {
            return new Error("Illegal card urgency level", ErrorType.BadRequest,
                "Urgency levels only go from 0-4");
        }
        
        bool hasEditCardPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasEditCardPermission) return Errors.Forbidden;

        Card? card = await cardRepository.GetCard(cardId);
        if (card is null) return Errors.NotFound;

        CardUrgencyLevel cardUrgencyLevel = (CardUrgencyLevel)urgencyLevel;
        Result setCardUrgencyResult = card.SetCardUrgency((CardUrgencyLevel)urgencyLevel);
        if (!setCardUrgencyResult.IsSuccess) return setCardUrgencyResult.Error!;
            
        await unitOfWork.SaveChangesAsync();
        cardNotificationService.UpdateCardUrgency(boardId, cardId, cardUrgencyLevel);

        return Result.Success();
    }

    public async Task<Result> AssignUser(int boardId, int cardId, Guid userId)
    {
        bool hasEditCardPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasEditCardPermission) return Errors.Forbidden;

        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;

        User? user = await accountRepository.GetUserByGuidAsync(userId);
        if (user is null) return Errors.NotFound;

        Result assignUserResult = card.AssignUser(user);
        if (!assignUserResult.IsSuccess) return assignUserResult.Error!;

        await unitOfWork.SaveChangesAsync();
        cardNotificationService.AssignUser(boardId, card.CardId, userId);
        
        return Result.Success();
    }

    public async Task<Result> UnassignUser(int boardId, int cardId, Guid userId)
    {
        bool hasEditCardPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasEditCardPermission) return Errors.Forbidden;

        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;

        Result unassignUserResult = card.RemoveAssignedUser(userId);
        if (!unassignUserResult.IsSuccess) return unassignUserResult.Error!;

        await unitOfWork.SaveChangesAsync();
        cardNotificationService.RemoveAssignedUser(boardId, card.CardId, userId);
        
        return Result.Success();
    }

    public async Task<Result<CardGetDto>> PatchCardName(int boardId, int cardId, PatchCardNameDto patchCardNameDto)
    {
        bool hasEditCardPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasEditCardPermission) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return Errors.NotFound;
            
        Result renameCardResult = card.RenameCard(patchCardNameDto.NewCardName);
        if (!renameCardResult.IsSuccess) return renameCardResult.Error!;
        await unitOfWork.SaveChangesAsync();
        
        CardGetDto cardGetDto = card.ToGetDto();
        cardNotificationService.PatchCardName(boardId, cardId, cardGetDto);
        return cardGetDto;
    }

    public async Task<Result<CardGetDto>> PatchCardStatus(int boardId, int cardId, bool isDone)
    {
        bool hasEditCardPermission = await cardAuthorizer.HasEditCardPermission(cardId, true);
        if (!hasEditCardPermission) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return Errors.NotFound;

        card.UpdateCardState(isDone);
        await unitOfWork.SaveChangesAsync();
        
        CardGetDto cardGetDto = card.ToGetDto();
        cardNotificationService.PathCardStatus(boardId, cardId, cardGetDto.IsDone);
        return cardGetDto;
    }

    public async Task<Result<CardGetDto>> PatchCardDescription(int cardId, PatchCardDescriptionDto patchCardDescriptionDto)
    {
        bool hasEditCardPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasEditCardPermission) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return Errors.NotFound;

        card.ChangeCardDescription(patchCardDescriptionDto.NewCardDescription);
        await unitOfWork.SaveChangesAsync();
        
        return card.ToGetDto();
    }

    public async Task<Result<CardGetDto>> GetCard(int cardId)
    {
        bool hasCardViewPermission = await cardAuthorizer.HasViewCardPermission(cardId);
        if (!hasCardViewPermission) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;
        
        return card.ToGetDto();
    }
}