using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories;

public interface IBoardRepository
{
    Task<Board?> CreateAsync(Board board);
    Task<Board?> UpdateAsync(Board board);
    Task<bool> DeleteAsync(int boardId);
    Task<List<Board>> GetAllAsync(int projectId);
    Task<Board?> GetAsync(int boardId);
}