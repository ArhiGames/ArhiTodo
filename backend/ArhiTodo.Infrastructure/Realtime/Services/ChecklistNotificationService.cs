using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class ChecklistNotificationService(IHubContext<BoardHub, IBoardClient> hubContext, ICurrentUser currentUser) : IChecklistNotificationService
{
    public void CreateChecklist(int boardId, int cardId, ChecklistGetDto checklistGetDto)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").CreateChecklist(cardId, checklistGetDto);
    }

    public void UpdateChecklist(int boardId, int cardId, ChecklistGetDto checklistGetDto)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").UpdateChecklist(cardId, checklistGetDto);
    }

    public void DeleteChecklist(int boardId, int checklistId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").DeleteChecklist(checklistId);
    }

    public void CreateChecklistItemOnChecklist(int boardId, int checklistId, ChecklistItemGetDto checklistItemGetDto)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").CreateChecklistItemOnChecklist(checklistId, checklistItemGetDto);
    }

    public void UpdateChecklistItem(int boardId, int checklistId, ChecklistItemGetDto checklistItemGetDto)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").UpdateChecklistItem(checklistId, checklistItemGetDto);
    }

    public void PatchChecklistItemDoneState(int boardId, int checklistItemId, bool taskDone)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").PatchChecklistItemDoneState(checklistItemId, taskDone);
    }

    public void DeleteChecklistItemFromChecklist(int boardId, int checklistId, int checklistItemId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").DeleteChecklistItemFromChecklist(checklistItemId);
    }
}