using ArhiTodo.Data;
using ArhiTodo.Interfaces;
using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Post;
using ArhiTodo.Models.DTOs.Put;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Repositories;

public class BoardRepository : IBoardRepository
{
    private readonly ProjectDataBase _projectsDatabase;

    public BoardRepository(ProjectDataBase projectsDatabase)
    {
        _projectsDatabase = projectsDatabase;
    }

    public async Task<Board?> CreateAsync(int projectId, BoardPostDto boardPostDto)
    {
        Project? project = await _projectsDatabase.Projects
            .Include(p => p.Boards)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null 
            || project.Boards.Any(b => b.BoardName == boardPostDto.BoardName))
        {
            throw new InvalidOperationException();
        }

        Board board = boardPostDto.FromPostDto();

        project.Boards.Add(board);
        await _projectsDatabase.SaveChangesAsync();
        return board;
    }

    public async Task<Board?> UpdateAsync(int projectId, BoardPutDto boardPutDto)
    {
        Project? project = await _projectsDatabase.Projects
            .Include(p => p.Boards)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null)
        {
            throw new InvalidOperationException();
        }
        
        Board? board = project.Boards.FirstOrDefault(b => b.BoardId == boardPutDto.BoardId);
        if (board == null)
        {
            throw new InvalidOperationException();
        }
        
        board.BoardName = boardPutDto.BoardName;
        _projectsDatabase.Boards.Update(board);
        await _projectsDatabase.SaveChangesAsync();
        return board;
    }

    public async Task<bool> DeleteAsync(int projectId, int boardId)
    {
        Project? project = await _projectsDatabase.Projects
            .Include(p => p.Boards)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null)
        {
            throw new InvalidOperationException();
        }
        
        Board? board = project.Boards.FirstOrDefault(b => b.BoardId == boardId);
        if (board == null)
        {
            throw new InvalidOperationException();
        }

        bool removed = project.Boards.Remove(board);
        await _projectsDatabase.SaveChangesAsync();
        return removed;
    }

    public async Task<List<Board>> GetAllAsync(int projectId)
    {
        Project? project = await _projectsDatabase.Projects
            .Include(p => p.Boards)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        
        // ReSharper disable once ConvertIfStatementToReturnStatement
        if (project == null)
        {
            throw new InvalidOperationException();
        }

        return project.Boards.ToList();
    }

    public async Task<Board?> GetAsync(int projectId, int boardId)
    {
        Board? board = await _projectsDatabase.Boards
            .Where(b => b.BoardId == boardId)
            .Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
                    .ThenInclude(c => c.CardLabels)
            .Include(b => b.Project)
            .FirstOrDefaultAsync();

        if (board == null)
        {
            return null;
        }

        Project? project = board.Project;
        if (project == null || project.ProjectId != projectId)
        {
            throw new InvalidOperationException();
        }
        
        return board;
    }
}