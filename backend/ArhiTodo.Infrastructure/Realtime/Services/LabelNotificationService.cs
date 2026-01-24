using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class LabelNotificationService(IHubContext<BoardHub, IBoardClient> hubContext) : ILabelNotificationService
{
    public void CreateLabel(int boardId, LabelGetDto label)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").CreateLabel(boardId, label);
    }

    public void UpdateLabel(int boardId, LabelGetDto label)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").UpdateLabel(boardId, label);
    }

    public void DeleteLabel(int boardId, int labelId)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").DeleteLabel(labelId);
    }

    public void AddLabelToCard(int boardId, int cardId, int labelId)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").AddLabelToCard(cardId, labelId);
    }

    public void RemoveLabelFromCard(int boardId, int cardId, int labelId)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").RemoveLabelFromCard(cardId, labelId);
    }
}