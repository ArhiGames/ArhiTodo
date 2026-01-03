using System.Data;
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
        if (project == null || project.Boards.Any(b => b.BoardName == boardPostDto.BoardName))
        {
            throw new DuplicateNameException();
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
            return null;
        }
        
        Board? board = project.Boards.FirstOrDefault(b => b.BoardId == boardPutDto.BoardId);
        if (board == null)
        {
            return null;
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
            return false;
        }
        
        Board? board = project.Boards.FirstOrDefault(b => b.BoardId == boardId);
        if (board == null)
        {
            return false;
        }

        bool removed = project.Boards.Remove(board);
        await _projectsDatabase.SaveChangesAsync();
        return removed;
    }

    public async Task<List<Board>> GetAllAsync(int projectId)
    {
        List<Board> boards = await _projectsDatabase.Boards
            .Where(b => b.ProjectId == projectId)
            .ToListAsync();

        return boards;
    }

    public async Task<Board?> GetAsync(int projectId, int boardId)
    {
        Board? board = await _projectsDatabase.Boards
            .Where(b => b.BoardId == boardId)
            .Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
                    .ThenInclude(c => c.CardLabels)
            .FirstOrDefaultAsync();

        return board ?? null;
    }
}