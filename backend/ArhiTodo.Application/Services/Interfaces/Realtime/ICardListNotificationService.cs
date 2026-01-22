using ArhiTodo.Application.DTOs.CardList;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface ICardListNotificationService
{
    void CreateCardList(int boardId, CardListGetDto cardList);
    void UpdateCardList(int boardId, CardListGetDto cardList);
    void DeleteCardsFromCardList(int boardId, int cardListId);
    void DeleteCardList(int boardId, int cardListId);
}