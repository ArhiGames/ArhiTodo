using ArhiTodo.DataBase;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using ArhiTodo.Models.DTOs.Put;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Services;

public class BoardService
{
    private readonly ProjectDataBase _projectsDatabase;

    public BoardService(ProjectDataBase projectsDatabase)
    {
        _projectsDatabase = projectsDatabase;
    }

    public async Task<Board?> CreateBoard(int projectId, BoardPostDto boardPostDto)
    {
        Project? project = await _projectsDatabase.Projects
            .Include(p => p.Boards)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null 
            || project.Boards.Any(b => b.BoardName == boardPostDto.BoardName))
        {
            throw new InvalidOperationException();
        }

        Board board = new()
        {
            BoardName = boardPostDto.BoardName
        };

        project.Boards.Add(board);
        await  _projectsDatabase.SaveChangesAsync();
        return board;
    }

    public async Task<Board?> UpdateBoard(int projectId, BoardPutDto boardPutDto)
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

    public async Task<bool> DeleteBoard(int projectId, int boardId)
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

    public async Task<List<Board>> GetBoards(int projectId)
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
}