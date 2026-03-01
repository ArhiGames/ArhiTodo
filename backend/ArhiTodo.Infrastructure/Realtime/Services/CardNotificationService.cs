using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class CardNotificationService(IHubContext<BoardHub, IBoardClient> hubContext, ICurrentUser currentUser) : ICardNotificationService
{
    public void CreateCard(int boardId, int cardListId, CardGetDto card)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").CreateCard(boardId, cardListId, card);
    }

    public void DeleteCard(int boardId, int cardId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").DeleteCard(cardId);
    }

    public void UpdateCardUrgency(int boardId, int cardId, CardUrgencyLevel cardUrgencyLevel)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").UpdateCardUrgencyLevel(cardId, cardUrgencyLevel);
    }

    public void MoveCard(int boardId, int cardId, int toCardList, int toIndex)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").MoveCard(cardId, toCardList, toIndex);
    }

    public void AssignUser(int boardId, int cardId, Guid userId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").AssignUser(cardId, userId);
    }

    public void RemoveAssignedUser(int boardId, int cardId, Guid userId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").RemoveAssignedUser(cardId, userId);
    }

    public void PatchCardName(int boardId, int cardId, CardGetDto card)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").PatchCardName(cardId, card);
    }

    public void PathCardStatus(int boardId, int cardId, bool isDone)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").PathCardStatus(cardId, isDone);
    }
}