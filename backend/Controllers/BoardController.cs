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
    private readonly BoardDataBase _board;
    
    public BoardController(BoardDataBase board, ILogger<BoardController> logger)
    {
        _board = board;
        
        logger.Log(LogLevel.Information, "Board controller initialized");
    }

    [HttpPost]
    public async Task<IActionResult> CreateBoard([FromBody] BoardPostDto boardPostDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (Enumerable.Any(_board.Boards, existingBoard => existingBoard.BoardName == boardPostDto.BoardName))
        {
            return Conflict("Board with that name already exists");
        }
        
        Board board = new()
        {
            BoardName = boardPostDto.BoardName
        };
        
        _board.Boards.Add(board);
        await _board.SaveChangesAsync();
        
        return Ok(new { board.BoardId });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateBoard([FromBody] BoardPutDto boardPutDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        Board? board = await  _board.Boards.FirstOrDefaultAsync(existingBoard => existingBoard.BoardId == boardPutDto.BoardId);
        if (board == null) return NotFound();

        await Task.Delay(1000);
        
        board.BoardName = boardPutDto.BoardName;
        await _board.SaveChangesAsync();

        return Ok(new { board.BoardId });
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteBoard([FromQuery] int boardId)
    {
        Board? board = await _board.Boards.FindAsync(boardId);
        if (board == null) return NotFound();
        
        _board.Boards.Remove(board);
        await _board.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetBoard()
    {
        List<Board> boards = await _board.Boards.ToListAsync();
        return Ok(boards);
    }
}