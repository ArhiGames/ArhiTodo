using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface ICardListService
{
    Task<Result<CardListGetDto>> CreateCardList(int boardId, CardListCreateDto cardListCreateDto);
    Task<Result<CardListGetDto>> UpdateCardList(int boardId, CardListUpdateDto cardListUpdateDto);
    Task<bool> DeleteCards(int boardId, int cardListId);
    Task<bool> DeleteCardList(int boardId, int cardListId);
}