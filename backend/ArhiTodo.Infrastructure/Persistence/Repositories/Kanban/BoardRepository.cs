using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

public class BoardRepository(ProjectDataBase database) : IBoardRepository
{
    public async Task<List<BoardUserClaim>?> UpdateBoardUserClaimAsync(int boardId, Guid userId, List<BoardUserClaim> boardUserClaims)
    {
        User? user = await database.Users
            .Include(u => u.BoardUserClaims)
            .FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null) return null;

        foreach (BoardUserClaim boardUserClaim in boardUserClaims)
        {
            BoardUserClaim? foundBoardUserClaim =
                user.BoardUserClaims.FirstOrDefault(buc => buc.Type == boardUserClaim.Type && buc.BoardId == boardUserClaim.BoardId);
            if (foundBoardUserClaim == null)
            {
                user.BoardUserClaims.Add(boardUserClaim);
            }
            else
            {
                foundBoardUserClaim.Value = boardUserClaim.Value;
            }
        }
        
        await database.SaveChangesAsync();
        return user.BoardUserClaims.Where(buc => buc.BoardId == boardId).ToList();
    }

    public async Task<List<User>> GetBoardMembers(int boardId)
    {
        List<User> users = await database.Users
            .Include(u => u.BoardUserClaims.Where(buc => buc.BoardId == boardId))
            .Where(u => u.BoardUserClaims.Any(buc => buc.Type == "view_board" && buc.Value == "true"))
            .ToListAsync();
        return users;
    }

    public async Task<Board?> CreateAsync(Board board)
    {
        EntityEntry<Board> boardEntry = database.Boards.Add(board);
        await database.SaveChangesAsync();
        return boardEntry.Entity;
    }

    public async Task<Board?> UpdateAsync(Board board)
    {
        EntityEntry<Board> boardEntry = database.Boards.Attach(board);

        boardEntry.Property(b => b.BoardName).IsModified = true;
        
        await database.SaveChangesAsync();
        return board;
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

    public async Task<Board?> GetAsync(int boardId)
    {
        Board? board = await database.Boards
            .Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
                    .ThenInclude(c => c.CardLabels)
            .Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
                    .ThenInclude(c => c.Checklists)
                        .ThenInclude(c => c.ChecklistItems)
            .AsSplitQuery()
            .FirstOrDefaultAsync(b => b.BoardId == boardId);

        return board;
    }
}