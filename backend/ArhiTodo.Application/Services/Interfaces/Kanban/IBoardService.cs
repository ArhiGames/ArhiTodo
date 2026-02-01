using System.Security.Claims;
using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.User;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IBoardService
{
    Task<List<ClaimGetDto>?> UpdateBoardUserClaim(int boardId, Guid userId, List<ClaimPostDto> claimPostDtos);
    Task<BoardGetDto?> CreateBoard(ClaimsPrincipal user, int projectId, BoardCreateDto boardCreateDto);
    Task<BoardGetDto?> UpdateBoard(ClaimsPrincipal user, int projectId, BoardUpdateDto boardUpdateDto);
    Task<bool> DeleteBoard(int projectId, int boardId);
    Task<List<BoardGetDto>> GetEveryBoard(int projectId);
    Task<BoardGetDto?> GetBoard(int boardId);
}