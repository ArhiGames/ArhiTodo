using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IBoardRepository
{
    Task<BoardUserClaim?> UpdateBoardUserClaimAsync(BoardUserClaim boardUserClaim);
    Task<Board?> CreateAsync(Board board);
    Task<Board?> UpdateAsync(Board board);
    Task<bool> DeleteAsync(int boardId);
    Task<List<Board>> GetAllAsync(int projectId);
    Task<Board?> GetAsync(int boardId);
}