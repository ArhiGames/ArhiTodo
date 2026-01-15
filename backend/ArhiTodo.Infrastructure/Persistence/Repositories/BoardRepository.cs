using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class BoardRepository(ProjectDataBase projectsDatabase) : IBoardRepository
{
    public async Task<Board?> CreateAsync(Board board)
    {
        EntityEntry<Board> boardEntry = projectsDatabase.Boards.Add(board);
        await projectsDatabase.SaveChangesAsync();
        return boardEntry.Entity;
    }

    public async Task<Board?> UpdateAsync(Board board)
    {
        EntityEntry<Board> boardEntry = projectsDatabase.Boards.Attach(board);

        boardEntry.Property(b => b.BoardName).IsModified = true;
        
        await projectsDatabase.SaveChangesAsync();
        return board;
    }

    public async Task<bool> DeleteAsync(int boardId)
    {
        int deletedRows = await projectsDatabase.Boards
            .Where(b => b.BoardId == boardId)
            .ExecuteDeleteAsync();
        return deletedRows == 1;
    }

    public async Task<List<Board>> GetAllAsync(int projectId)
    {
        List<Board> boards = await projectsDatabase.Boards
            .Where(b => b.ProjectId == projectId)
            .ToListAsync();

        return boards;
    }

    public async Task<Board?> GetAsync(int boardId)
    {
        Board? board = await projectsDatabase.Boards
            .Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
                    .ThenInclude(c => c.CardLabels)
            .Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
                    .ThenInclude(c => c.Checklists)
                        .ThenInclude(c => c.ChecklistItems)
            .AsSplitQuery()
            .FirstOrDefaultAsync();

        return board;
    }
}