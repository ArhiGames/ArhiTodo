using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IBoardService
{
    Task<List<ClaimGetDto>?> UpdateBoardUserClaim(int boardId, Guid userId, List<ClaimPostDto> claimPostDtos);
    Task<List<UserGetDto>> GetBoardMembers(int boardId);
    Task<List<UserGetDto>?> UpdateBoardMemberStatus(int boardId,
        List<BoardMemberStatusUpdateDto> boardMemberStatusUpdateDtos);
    
    Task<Result<BoardGetDto>> CreateBoard(int projectId, BoardCreateDto boardCreateDto);
    Task<Result<BoardGetDto>> UpdateBoard(int projectId, BoardUpdateDto boardUpdateDto);
    Task<bool> DeleteBoard(int projectId, int boardId);
    
    Task<List<BoardGetDto>> GetEveryBoard(int projectId);
    Task<BoardGetDto?> GetBoard(int boardId);
}