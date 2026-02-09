using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IBoardRepository
{
    Task<List<BoardUserClaim>> GetBoardPermissions(int boardId);

    public enum BoardIncludeData
    {
        None,
        CardLists,
        Cards,
        Checklists,
        ChecklistItems
    }
    
    Task<Board?> GetAsync(int boardId, bool includeProject, BoardIncludeData boardIncludeData = BoardIncludeData.None);
    Task<Board?> GetAsync(Guid userId, int boardId, bool includeProject, BoardIncludeData boardIncludeData = BoardIncludeData.None);
    
    Task<List<Board>> GetAllAsync(int projectId);
    Task<List<Board>> GetAllAsync(Guid userId, int projectId);
}