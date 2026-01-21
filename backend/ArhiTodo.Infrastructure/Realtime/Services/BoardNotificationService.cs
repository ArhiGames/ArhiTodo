using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class BoardNotificationService(IHubContext<BoardHub, IBoardClient> hubContext) : IBoardNotificationService
{
    public void CreateBoard(Guid invokedBy, int projectId, BoardGetDto boardGetDto)
    {
        hubContext.Clients.Groups("test").CreateBoard(projectId, boardGetDto);
    }

    public void DeleteBoard(Guid invokedBy, int boardId)
    {
        hubContext.Clients.Groups("test").DeleteBoard(boardId);
    }
}