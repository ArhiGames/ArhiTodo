using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IBoardRepository
{
    Task<BoardUserClaim> AddBoardUserClaimAsync(BoardUserClaim boardUserClaim);
    Task<List<BoardUserClaim>?> UpdateBoardUserClaimAsync(int boardId, Guid userId, List<BoardUserClaim> boardUserClaims);
    Task<List<User>> GetBoardMembers(int boardId);
    Task<bool> DeleteBoardClaims(int boardId, Guid userId); 
    
    Task<Board?> CreateAsync(Board board);
    Task<Board?> UpdateAsync(Board board);
    Task<bool> DeleteAsync(int boardId);
    
    Task<List<Board>> GetAllAsync(int projectId);
    Task<Board?> GetAsync(int boardId);
}