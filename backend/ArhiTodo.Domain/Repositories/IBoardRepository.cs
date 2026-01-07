using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Domain.Repositories;

public interface IBoardRepository
{
    Task<Board?> CreateAsync(int projectId, BoardPostDto boardPostDto);
    Task<Board?> UpdateAsync(int projectId, BoardPutDto boardPutDto);
    Task<bool> DeleteAsync(int projectId, int boardId);
    Task<List<Board>> GetAllAsync(int projectId);
    Task<BoardGetDto?> GetAsync(int projectId, int boardId);
}