using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class CardListNotificationService(IHubContext<BoardHub, IBoardClient> hubContext) : ICardListNotificationService
{
    public void CreateCardList(int boardId, CardListGetDto cardList)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").CreateCardList(boardId, cardList);
    }

    public void UpdateCardList(int boardId, CardListGetDto cardList)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").UpdateCardList(boardId, cardList);
    }

    public void DeleteCardsFromCardList(int boardId, int cardListId)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").DeleteCardsFromCardList(cardListId);
    }

    public void DeleteCardList(int boardId, int cardListId)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").DeleteCardList(cardListId);
    }
}