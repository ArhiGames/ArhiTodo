using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class LabelNotificationService(IHubContext<BoardHub, IBoardClient> hubContext, ICurrentUser currentUser) : ILabelNotificationService
{
    public void CreateLabel(int boardId, LabelGetDto label)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").CreateLabel(boardId, label);
    }

    public void UpdateLabel(int boardId, LabelGetDto label)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").UpdateLabel(boardId, label);
    }

    public void DeleteLabel(int boardId, int labelId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").DeleteLabel(labelId);
    }

    public void AddLabelToCard(int boardId, int cardId, int labelId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").AddLabelToCard(cardId, labelId);
    }

    public void RemoveLabelFromCard(int boardId, int cardId, int labelId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").RemoveLabelFromCard(cardId, labelId);
    }
}