using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.DTOs;
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

    public void MoveCard(int boardId, int cardId, int toCardList, int toIndex)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").MoveCard(cardId, toCardList, toIndex);
    }

    public void PatchCardName(int boardId, int cardId, CardGetDto card)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").PatchCardName(cardId, card);
    }

    public void PathCardStatus(int boardId, int cardId, bool isDone)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").PathCardStatus(cardId, isDone);
    }
}