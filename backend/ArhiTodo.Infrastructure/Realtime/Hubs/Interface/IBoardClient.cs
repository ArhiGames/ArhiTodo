using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Application.DTOs.CardList;

namespace ArhiTodo.Infrastructure.Realtime.Hubs.Interface;

public interface IBoardClient
{
    Task CreateBoard(int projectId, BoardGetDto board);
    Task UpdateBoard(int projectId, BoardGetDto board);
    Task DeleteBoard(int boardId);

    Task CreateCardList(int boardId, CardListGetDto cardList);
    Task UpdateCardList(int boardId, CardListGetDto cardList);
    Task DeleteCardsFromCardList(int cardListId);
    Task DeleteCardList(int cardListId);
    
    Task CreateCard(int boardId, int cardListId, CardGetDto card);
    Task DeleteCard(int cardId);
}