using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IBoardRepository
{
    Task<List<BoardUserClaim>?> UpdateBoardUserClaimAsync(int boardId, Guid userId, List<BoardUserClaim> boardUserClaims);
    Task<Board?> CreateAsync(Board board);
    Task<Board?> UpdateAsync(Board board);
    Task<bool> DeleteAsync(int boardId);
    Task<List<Board>> GetAllAsync(int projectId);
    Task<Board?> GetAsync(int boardId);
}