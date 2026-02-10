using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.DTOs;
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
    
    Task<Board> CreateBoardAsync(Board board);
    Task RemoveBoardAsync(Board board);
    
    Task<BoardGetDto?> GetReadModelAsync(int boardId);
    Task<Board?> GetAsync(int boardId, bool includeLabels = false, bool includeCardLists = false);
    
    Task<List<Board>> GetAllAsync(int projectId);
    Task<List<Board>> GetAllAsync(Guid userId, int projectId);
}