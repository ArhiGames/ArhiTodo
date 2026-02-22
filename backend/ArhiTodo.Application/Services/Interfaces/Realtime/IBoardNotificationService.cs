using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Domain.Entities.DTOs;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface IBoardNotificationService
{
    void CreateBoard(int projectId, BoardGetDto boardGetDto);
    void UpdateBoard(int projectId, BoardGetDto boardGetDto);
    void DeleteBoard(int projectId, int boardId);
    void AddBoardMember(int boardId, PublicUserGetDto publicUserGetDto);
    void RemoveBoardMember(int boardId, Guid userId);
    void UpdateUserBoardPermissions(Guid userId, int boardId, List<ClaimGetDto> claimGetDtos);
}