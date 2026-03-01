using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface ICardListService
{
    Task<Result<CardListGetDto>> CreateCardList(int boardId, CardListCreateDto cardListCreateDto);
    Task<Result<CardListGetDto>> UpdateCardList(int boardId, CardListUpdateDto cardListUpdateDto);
    Task<Result> MoveCardList(int boardId, int cardListId, int location);
    Task<Result> DeleteCards(int boardId, int cardListId);
    Task<Result> DeleteCardList(int boardId, int cardListId);
}