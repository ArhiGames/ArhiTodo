using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class BoardService(IBoardNotificationService boardNotificationService, IBoardRepository boardRepository) : IBoardService
{
    public async Task<List<ClaimGetDto>?> UpdateBoardUserClaim(int boardId, Guid userId, List<ClaimPostDto> claimPostDtos)
    {
        List<BoardUserClaim>? boardUserClaims =
            await boardRepository.UpdateBoardUserClaimAsync(boardId, userId, claimPostDtos.Select(c => c.ToBoardUserClaim(userId, boardId)).ToList());
        return boardUserClaims?.Select(buc => buc.ToGetDto()).ToList();
    }

    public async Task<BoardGetDto?> CreateBoard(int projectId, BoardCreateDto boardCreateDto)
    {
        Board? board = await boardRepository.CreateAsync(boardCreateDto.FromCreateDto(projectId));
        if (board == null) return null;
        
        BoardGetDto boardGetDto = board.ToGetDto();
        boardNotificationService.CreateBoard(Guid.NewGuid(), projectId, boardGetDto);
        return boardGetDto;
    }

    public async Task<BoardGetDto?> UpdateBoard(int projectId, BoardUpdateDto boardUpdateDto)
    {
        Board? board = await boardRepository.UpdateAsync(boardUpdateDto.FromUpdateDto());
        if (board == null) return null;

        BoardGetDto boardGetDto = board.ToGetDto();
        boardNotificationService.UpdateBoard(Guid.NewGuid(), projectId, boardGetDto);
        return boardGetDto;
    }

    public async Task<bool> DeleteBoard(int projectId, int boardId)
    {
        bool succeeded = await boardRepository.DeleteAsync(boardId);

        if (succeeded)
        {
            boardNotificationService.DeleteBoard(Guid.NewGuid(), projectId, boardId);
        }
        
        return succeeded;
    }

    public async Task<List<BoardGetDto>> GetEveryBoard(int projectId)
    {
        List<Board> boards = await boardRepository.GetAllAsync(projectId);
        return boards.Select(b => b.ToGetDto()).ToList();
    }

    public async Task<BoardGetDto?> GetBoard(int boardId)
    {
        Board? board = await boardRepository.GetAsync(boardId);
        return board?.ToGetDto();
    }
}