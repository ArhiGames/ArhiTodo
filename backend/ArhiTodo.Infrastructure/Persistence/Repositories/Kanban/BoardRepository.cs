using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

public class BoardRepository(ProjectDataBase database) : IBoardRepository
{
    public async Task<List<User>> GetBoardMembers(int boardId)
    {
        List<User> users = await database.Users
            .Include(u => u.BoardUserClaims.Where(buc => buc.BoardId == boardId))
            .Where(u => u.BoardUserClaims.Any(buc => buc.BoardId == boardId && buc.Type == nameof(BoardClaims.ViewBoard) && buc.Value == "true"))
            .ToListAsync();
        return users;
    }

    public async Task<Board> CreateAsync(Board board)
    {
        EntityEntry<Board> boardEntry = database.Boards.Add(board);
        await database.SaveChangesAsync();
        return boardEntry.Entity;
    }

    public async Task<bool> DeleteAsync(int boardId)
    {
        int deletedRows = await database.Boards
            .Where(b => b.BoardId == boardId)
            .ExecuteDeleteAsync();
        return deletedRows == 1;
    }

    public async Task<List<Board>> GetAllAsync(int projectId)
    {
        List<Board> boards = await database.Boards
            .Where(b => b.ProjectId == projectId)
            .ToListAsync();

        return boards;
    }

    public async Task<Board?> GetAsync(int boardId, bool includeCardlists = true, bool includeCards = true, 
        bool includeChecklists = false, bool includeChecklistItems = false)
    {
        IQueryable<Board> query = database.Boards
            .Include(b => b.Owner)
            .Include(b => b.Labels)
            .Include(b => b.BoardUserClaims);

        if (includeChecklistItems)
        {
            query = query.Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
                    .ThenInclude(c => c.Checklists)
                        .ThenInclude(cl => cl.ChecklistItems);
        }
        else if (includeChecklists)
        {
            query = query.Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
                    .ThenInclude(c => c.Checklists);
        }
        else if (includeCards)
        {
            query = query
                .Include(b => b.CardLists)
                    .ThenInclude(cl => cl.Cards)
                        .ThenInclude(c => c.Labels);
        }
        else if (includeCardlists)
        {
            query = query.Include(b => b.CardLists);
        }

        if (includeCardlists && includeCards)
        {
            query = query
                .Include(b => b.CardLists)
                    .ThenInclude(cl => cl.Cards)
                        .ThenInclude(c => c.Labels);
        } 

        Board? board = await query.AsSplitQuery().FirstOrDefaultAsync(b => b.BoardId == boardId);
        return board;
    }
}