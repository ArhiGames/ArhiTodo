using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class ChecklistNotificationService(IHubContext<BoardHub, IBoardClient> hubContext) : IChecklistNotificationService
{
    public void CreateChecklist(int boardId, int cardId, ChecklistGetDto checklistGetDto)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").CreateChecklist(cardId, checklistGetDto);
    }

    public void UpdateChecklist(int boardId, int cardId, ChecklistGetDto checklistGetDto)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").UpdateChecklist(cardId, checklistGetDto);
    }

    public void DeleteChecklist(int boardId, int checklistId)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").DeleteChecklist(checklistId);
    }

    public void CreateChecklistItemOnChecklist(int boardId, int checklistId, ChecklistItemGetDto checklistItemGetDto)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").CreateChecklistItemOnChecklist(checklistId, checklistItemGetDto);
    }

    public void UpdateChecklistItem(int boardId, int checklistId, ChecklistItemGetDto checklistItemGetDto)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").UpdateChecklistItem(checklistId, checklistItemGetDto);
    }

    public void PatchChecklistItemDoneState(int boardId, int checklistItemId, bool taskDone)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").PatchChecklistItemDoneState(checklistItemId, taskDone);
    }

    public void DeleteChecklistItemFromChecklist(int boardId, int checklistId, int checklistItemId)
    {
        hubContext.Clients.Group($"grp-board-{boardId}").DeleteChecklistItemFromChecklist(checklistItemId);
    }
}