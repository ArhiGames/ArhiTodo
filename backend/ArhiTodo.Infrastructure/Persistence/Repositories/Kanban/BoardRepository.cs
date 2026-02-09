using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

public class BoardRepository(ProjectDataBase database) : IBoardRepository
{
    private IQueryable<Board> GetBoardQuery(bool includeProject, IBoardRepository.BoardIncludeData boardIncludeData)
    {
        IQueryable<Board> query = database.Boards
            .Include(b => b.Owner)
            .Include(b => b.Labels)
            .Include(b => b.BoardUserClaims);

        switch (boardIncludeData)
        {
            case IBoardRepository.BoardIncludeData.None:
                break;
            case IBoardRepository.BoardIncludeData.CardLists:
                query = query.Include(b => b.CardLists);
                break;
            case IBoardRepository.BoardIncludeData.Cards:
                query = query.Include(b => b.CardLists).ThenInclude(cl => cl.Cards).ThenInclude(c => c.Labels);
                break;
            case IBoardRepository.BoardIncludeData.Checklists:
                query = query.Include(b => b.CardLists).ThenInclude(cl => cl.Cards).ThenInclude(c => c.Labels);
                query = query.Include(b => b.CardLists).ThenInclude(cl => cl.Cards).ThenInclude(c => c.Checklists);
                break;
            case IBoardRepository.BoardIncludeData.ChecklistItems:
                query = query.Include(b => b.CardLists).ThenInclude(cl => cl.Cards).ThenInclude(c => c.Labels);
                query = query.Include(b => b.CardLists).ThenInclude(cl => cl.Cards)
                    .ThenInclude(c => c.Checklists).ThenInclude(cl => cl.ChecklistItems);
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(boardIncludeData), boardIncludeData, null);
        }
        
        if (includeProject)
        {
            query = query
                .Include(b => b.Project).ThenInclude(p => p.Owner)
                .Include(b => b.Project).ThenInclude(p => p.ProjectManagers);
        }

        return query;
    }
    
    public async Task<List<BoardUserClaim>> GetBoardPermissions(int boardId)
    {
        List<BoardUserClaim> boardPermissions = await database.BoardUserClaims
            .Where(buc => buc.BoardId == boardId)
            .ToListAsync();
        return boardPermissions;
    }

    public async Task<Board?> GetAsync(int boardId, bool includeProject, 
        IBoardRepository.BoardIncludeData boardIncludeData = IBoardRepository.BoardIncludeData.None)
    {
        IQueryable<Board> query = GetBoardQuery(includeProject, boardIncludeData);
        
        Board? board = await query.AsSplitQuery().FirstOrDefaultAsync(b => b.BoardId == boardId);
        return board;
    }

    public async Task<Board?> GetAsync(Guid userId, int boardId, bool includeProject, 
        IBoardRepository.BoardIncludeData boardIncludeData = IBoardRepository.BoardIncludeData.None)
    {
        bool hasAccess = await database.Boards.AnyAsync(b => b.BoardId == boardId &&
            (b.Project.ProjectManagers.Any(pm => pm.UserId == userId) ||
            b.BoardUserClaims.Any(buc => buc.UserId == userId && buc.Type == BoardClaimTypes.ViewBoard && buc.Value == "true")));
        if (!hasAccess) return null;
        
        IQueryable<Board> query = GetBoardQuery(includeProject, boardIncludeData);

        Board? board = await query.FirstOrDefaultAsync(b => b.BoardId == boardId);
        return board;
    }

    public async Task<List<Board>> GetAllAsync(int projectId)
    {
        List<Board> boards = await database.Boards
            .Where(b => b.ProjectId == projectId) 
            .ToListAsync();
        return boards;
    }

    public async Task<List<Board>> GetAllAsync(Guid userId, int projectId)
    {
        List<Board> boards = await database.Boards
            .Where(b => b.ProjectId == projectId && 
                        (b.Project.ProjectManagers.Any(pm => pm.UserId == userId) || 
                         b.BoardUserClaims.Any(buc => buc.UserId == userId && buc.Type == BoardClaimTypes.ViewBoard && buc.Value == "true")))
            .ToListAsync();

        return boards;
    }
}