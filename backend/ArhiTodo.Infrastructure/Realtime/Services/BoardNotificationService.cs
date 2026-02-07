using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class BoardNotificationService(IHubContext<BoardHub, IBoardClient> hubContext) : IBoardNotificationService
{
    public void CreateBoard(int projectId, BoardGetDto boardGetDto)
    {
        hubContext.Clients.Group($"grp-project-{projectId}").CreateBoard(projectId, boardGetDto);
    }

    public void UpdateBoard(int projectId, BoardGetDto boardGetDto)
    {
        hubContext.Clients.Group($"grp-project-{projectId}").UpdateBoard(projectId, boardGetDto);
    }

    public void DeleteBoard(int projectId, int boardId)
    {
        hubContext.Clients.Group($"grp-project-{projectId}").DeleteBoard(boardId);
    }
}