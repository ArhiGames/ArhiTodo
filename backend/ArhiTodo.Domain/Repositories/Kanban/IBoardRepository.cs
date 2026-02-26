using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IBoardRepository
{
    Task RemoveAssignedCardUsers(int boardId, List<Guid> userIds);
    
    Task<BoardGetDto?> GetReadModelAsync(int boardId);
    Task<Board?> GetAsync(int boardId, bool includeLabels = false, bool includeCardLists = false, bool includeCards = false);
    
    Task<List<Board>> GetAllAsync(int projectId);
    Task<List<Board>> GetAllAsync(Guid userId, int projectId);
}