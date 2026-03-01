using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class BoardNotificationService(IHubContext<BoardHub, IBoardClient> hubContext, ICurrentUser currentUser) : IBoardNotificationService
{
    public void CreateBoard(int projectId, BoardGetDto boardGetDto)
    {
        hubContext.Clients.GroupExcept($"grp-project-{projectId}", currentUser.ConnectionId ?? "").CreateBoard(projectId, boardGetDto);
    }

    public void UpdateBoard(int projectId, BoardGetDto boardGetDto)
    {
        hubContext.Clients.GroupExcept($"grp-project-{projectId}", currentUser.ConnectionId ?? "").UpdateBoard(projectId, boardGetDto);
    }

    public void DeleteBoard(int projectId, int boardId)
    {
        hubContext.Clients.GroupExcept($"grp-project-{projectId}", currentUser.ConnectionId ?? "").DeleteBoard(boardId);
    }

    public void AddBoardMember(int boardId, PublicUserGetDto publicUserGetDto)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").AddBoardMember(boardId, publicUserGetDto);
    }

    public void RemoveBoardMember(int boardId, Guid userId)
    {
        hubContext.Clients.GroupExcept($"grp-board-{boardId}", currentUser.ConnectionId ?? "").RemoveBoardMember(boardId, userId);
    }

    public void UpdateUserBoardPermissions(Guid userId, int boardId, List<ClaimGetDto> claimGetDtos)
    {
        hubContext.Clients.User(userId.ToString()).UpdateUserBoardPermissions(boardId, claimGetDtos);
    }
}