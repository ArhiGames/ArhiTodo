using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class CardListService(IBoardRepository boardRepository, IUnitOfWork unitOfWork, 
    ICardListNotificationService cardListNotificationService) : ICardListService
{
    public async Task<Result<CardListGetDto>> CreateCardList(int boardId, CardListCreateDto cardListCreateDto)
    {
        Board? board = await boardRepository.GetAsync(boardId, true, false);
        if (board is null) return Errors.NotFound;

        Result<CardList> createCardlistResult = CardList.Create(boardId, cardListCreateDto.CardListName);
        if (!createCardlistResult.IsSuccess) return createCardlistResult.Error!;
        
        board.AddCardlist(createCardlistResult.Value!);
        await unitOfWork.SaveChangesAsync();

        CardListGetDto cardListGetDto = createCardlistResult.Value!.ToGetDto();
        cardListNotificationService.CreateCardList(boardId, cardListGetDto);
        return cardListGetDto;
    }

    public async Task<Result<CardListGetDto>> UpdateCardList(int boardId, CardListUpdateDto cardListUpdateDto)
    {
        Board? board = await boardRepository.GetAsync(boardId, true, false);
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

    public async Task<bool> DeleteCards(int boardId, int cardListId)
    {
        Board? board = await boardRepository.GetAsync(boardId);
        if (board == null) return false;

        CardList? cardList = board.CardLists.FirstOrDefault(cl => cl.CardListId == cardListId);
        if (cardList == null) return false;
        
        cardList.ClearCards();
        await unitOfWork.SaveChangesAsync();
        
        cardListNotificationService.DeleteCardsFromCardList(boardId, cardListId);
        return true;
    }

    public async Task<bool> DeleteCardList(int boardId, int cardListId)
    {
        Board? board = await boardRepository.GetAsync(boardId);
        if (board == null) return false;

        Result removeCardlistResult = board.RemoveCardlist(cardListId);
        await unitOfWork.SaveChangesAsync();
        
        if (removeCardlistResult.IsSuccess)
        {
            cardListNotificationService.DeleteCardList(boardId, cardListId);
        }
        return removeCardlistResult.IsSuccess;
    }
}