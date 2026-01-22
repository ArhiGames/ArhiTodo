using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class CardNotificationService(IHubContext<BoardHub, IBoardClient> hubContext) : ICardNotificationService
{
    public void CreateCard(int boardId, int cardListId, CardGetDto card)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").CreateCard(boardId, cardListId, card);
    }

    public void DeleteCard(int boardId, int cardId)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").DeleteCard(cardId);
    }
}