using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class CardListNotificationService(IHubContext<BoardHub, IBoardClient> hubContext, ICurrentUser currentUser) : ICardListNotificationService
{
    public void CreateCardList(int boardId, CardListGetDto cardList)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").CreateCardList(boardId, cardList);
    }

    public void UpdateCardList(int boardId, CardListGetDto cardList)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").UpdateCardList(boardId, cardList);
    }

    public void DeleteCardsFromCardList(int boardId, int cardListId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").DeleteCardsFromCardList(cardListId);
    }

    public void DeleteCardList(int boardId, int cardListId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").DeleteCardList(cardListId);
    }
}