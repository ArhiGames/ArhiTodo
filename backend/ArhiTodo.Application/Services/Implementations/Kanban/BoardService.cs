using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class BoardService(IBoardNotificationService boardNotificationService, IBoardRepository boardRepository) : IBoardService
{
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
        return board?.ToGetDto();
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