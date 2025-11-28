using ArhiTodo.DataBase;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using ArhiTodo.Models.DTOs.Put;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BoardController : ControllerBase
{
    private readonly ProjectDataBase _projectsDatabase;
    
    public BoardController(ProjectDataBase projectsDatabase, ILogger<BoardController> logger)
    {
        _projectsDatabase = projectsDatabase;
        
        logger.Log(LogLevel.Information, "Board controller initialized");
    }

    [HttpPost]
    public async Task<IActionResult> CreateBoard(int projectId, [FromBody] BoardPostDto boardPostDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        Project? project = await _projectsDatabase.Projects
            .Include(project => project.Boards)
            .FirstOrDefaultAsync(existingProject => existingProject.ProjectId == projectId);
        if (project == null) return NotFound();
        
        if (project.Boards.Any(existingBoard => existingBoard.BoardName == boardPostDto.BoardName))
        {
            return Conflict("Board with that name already exists");
        }
        
        Board board = new()
        {
            BoardName = boardPostDto.BoardName
        };
        
        project.Boards.Add(board);
        await _projectsDatabase.SaveChangesAsync();
        
        return Ok(new { board.BoardId });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateBoard(int projectId, [FromBody] BoardPutDto boardPutDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        Project? project = await _projectsDatabase.Projects
            .Include(p => p.Boards)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null) return NotFound();
        
        Board? board = project.Boards.FirstOrDefault(existingBoard => existingBoard.BoardId == boardPutDto.BoardId);
        if (board == null) return NotFound();

        await Task.Delay(1000);
        
        board.BoardName = boardPutDto.BoardName;
        await _projectsDatabase.SaveChangesAsync();

        return Ok(new { board.BoardId });
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteBoard(int projectId, int boardId)
    {
        Project? project = await _projectsDatabase.Projects
            .Include(p => p.Boards)
            .FirstOrDefaultAsync(existingProject => existingProject.ProjectId == projectId);
        if (project == null) return NotFound();
        
        Board? board = project.Boards.FirstOrDefault(b => b.BoardId == boardId);
        if (board == null) return NotFound();
        
        project.Boards.Remove(board);
        await _projectsDatabase.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetBoards(int projectId)
    {
        Project? project = await  _projectsDatabase.Projects
            .Include(p => p.Boards)
            .FirstOrDefaultAsync(existingProject => existingProject.ProjectId == projectId);
        if (project == null) return NotFound();

        List<Board> boards = project.Boards;
        return Ok(boards);
    }
}