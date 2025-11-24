using ArhiTodo.DataBase;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

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

    [HttpGet]
    public IActionResult GetBoard()
    {
        return Ok(_board.Boards);
    }
}