using ArhiTodo.Domain.Entities;
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

    // @Todo
    public Task<Board?> GetAsync(int boardId)
    {
        /*BoardGetDto? boardGetDto = await projectsDatabase.Boards
            .Where(b => b.BoardId == boardId)
            .Select(b => new BoardGetDto()
            {
                BoardId = b.BoardId,
                BoardName = b.BoardName,
                
                CardLists = b.CardLists.Select(cl => new CardListGetDto()
                {
                    CardListId = cl.CardListId,
                    CardListName = cl.CardListName,
                    
                    Cards = cl.Cards.Select(c => new CardGetDto()
                    {
                        CardId = c.CardId,
                        CardName = c.CardName,
                        
                        Labels = c.CardLabels.Select(l => new CardLabelGetDto()
                        {
                            LabelId = l.LabelId
                        }).ToList(),
                        
                        TotalTasks = c.Checklists
                            .SelectMany(ch => ch.ChecklistItems)
                            .Count(),
                        
                        TotalTasksCompleted = c.Checklists
                            .SelectMany(ch => ch.ChecklistItems)
                            .Count(i => i.IsDone)
                        
                    }).ToList()
                }).ToList()
            })
            .FirstOrDefaultAsync();

        return boardGetDto ?? null;*/
        throw new NotImplementedException();
    }
}