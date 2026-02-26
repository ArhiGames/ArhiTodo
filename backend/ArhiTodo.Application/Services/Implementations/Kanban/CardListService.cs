using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Authorization;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class CardListService(IBoardRepository boardRepository, IUnitOfWork unitOfWork, 
    ICardListNotificationService cardListNotificationService, ICardListAuthorizer cardListAuthorizer) : ICardListService
{
    public async Task<Result<CardListGetDto>> CreateCardList(int boardId, CardListCreateDto cardListCreateDto)
    {
        bool hasCreateCardListPermission = await cardListAuthorizer.HasCreateCardListPermission(boardId);
        if (!hasCreateCardListPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId, false, true);
        if (board is null) return Errors.NotFound;

        List<CardList> sortedCardLists = board.CardLists.OrderBy(cl => cl.Position).ToList(); 

        Result<CardList> createCardlistResult = CardList.Create(boardId, cardListCreateDto.CardListName,
            sortedCardLists.Count > 0 ? sortedCardLists.Last().Position : null);
        if (!createCardlistResult.IsSuccess) return createCardlistResult.Error!;
        
        board.AddCardlist(createCardlistResult.Value!);
        await unitOfWork.SaveChangesAsync();

        CardListGetDto cardListGetDto = createCardlistResult.Value!.ToGetDto();
        cardListNotificationService.CreateCardList(boardId, cardListGetDto);
        return cardListGetDto;
    }

    public async Task<Result<CardListGetDto>> UpdateCardList(int boardId, CardListUpdateDto cardListUpdateDto)
    {
        bool hasEditCardListPermission = await cardListAuthorizer.HasEditCardListPermission(cardListUpdateDto.CardListId);
        if (!hasEditCardListPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId, false, true);
        if (board is null) return Errors.NotFound;

        CardList? cardList = board.CardLists.FirstOrDefault(cl => cl.CardListId == cardListUpdateDto.CardListId);
        if (cardList is null) return Errors.NotFound;
        
        Result updateCardListNameResult = cardList.ChangeCardListName(cardListUpdateDto.CardListName);
        if (!updateCardListNameResult.IsSuccess) return updateCardListNameResult.Error!;
        
        await unitOfWork.SaveChangesAsync();

        CardListGetDto cardListGetDto = cardList.ToGetDto();
        cardListNotificationService.UpdateCardList(boardId, cardListGetDto);
        return cardListGetDto;
    }

    public async Task<Result> DeleteCards(int boardId, int cardListId)
    {
        bool hasDeleteCardsFromCardListPermission = await cardListAuthorizer.HasDeleteCardsFromCardListPermission(cardListId);
        if (!hasDeleteCardsFromCardListPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId, false, true, true);
        if (board is null) return Errors.NotFound;

        CardList? cardList = board.CardLists.FirstOrDefault(cl => cl.CardListId == cardListId);
        if (cardList is null) return Errors.NotFound;

        cardList.ClearCards();
        await unitOfWork.SaveChangesAsync();

        cardListNotificationService.DeleteCardsFromCardList(boardId, cardListId);
        return Result.Success();
    }

    public async Task<Result> DeleteCardList(int boardId, int cardListId)
    {
        bool hasDeleteCardListPermission = await cardListAuthorizer.HasDeleteCardListPermission(cardListId);
        if (!hasDeleteCardListPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId, false, true);
        if (board is null) return Errors.NotFound;

        Result removeCardlistResult = board.RemoveCardlist(cardListId);
        await unitOfWork.SaveChangesAsync();

        if (removeCardlistResult.IsSuccess)
        {
            cardListNotificationService.DeleteCardList(boardId, cardListId);
        }
        return removeCardlistResult;
    }
}