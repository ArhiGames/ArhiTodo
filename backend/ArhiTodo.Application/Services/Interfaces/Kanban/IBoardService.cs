using ArhiTodo.Application.DTOs.Board;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IBoardService
{
    Task<BoardGetDto?> CreateBoard(int projectId, BoardCreateDto boardCreateDto);
    Task<BoardGetDto?> UpdateBoard(int projectId, BoardUpdateDto boardUpdateDto);
    Task<bool> DeleteBoard(int boardId);
    Task<List<BoardGetDto>> GetEveryBoard(int projectId);
    Task<BoardGetDto?> GetBoard(int boardId);
}