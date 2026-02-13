using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IBoardService
{
    Task<Result<List<ClaimGetDto>>> UpdateBoardUserClaim(int boardId, Guid userId, List<ClaimPostDto> claimPostDtos);
    Task<Result<List<UserGetDto>>> GetBoardMembers(int boardId);
    Task<Result<List<UserGetDto>>> UpdateBoardMemberStatus(int boardId, 
        List<BoardMemberStatusUpdateDto> boardMemberStatusUpdateDtos);
    
    Task<Result<BoardGetDto>> CreateBoard(int projectId, BoardCreateDto boardCreateDto);
    Task<Result<BoardGetDto>> UpdateBoard(int projectId, BoardUpdateDto boardUpdateDto);
    Task<Result> DeleteBoard(int projectId, int boardId);
    
    Task<Result<List<BoardGetDto>>> GetEveryBoard(int projectId);
    Task<Result<BoardGetDto>> GetBoard(int boardId);
    Task<Result<List<ClaimGetDto>>> GetUserBoardClaims(int boardId);
}