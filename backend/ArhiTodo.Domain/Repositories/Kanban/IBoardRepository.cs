using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IBoardRepository
{
    Task<List<User>> GetBoardMembers(int boardId);
    
    Task<Board?> CreateAsync(Board board);
    Task<bool> DeleteAsync(int boardId);
    Task<Board?> GetAsync(int boardId, bool includeCardlists = true, bool includeCards = true, 
        bool includeChecklists = false, bool includeChecklistItems = false);
    Task<List<Board>> GetAllAsync(int projectId);
}