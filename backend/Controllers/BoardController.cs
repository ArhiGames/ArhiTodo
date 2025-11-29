using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using ArhiTodo.Models.DTOs.Put;
using ArhiTodo.Services;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BoardController : ControllerBase
{
    private readonly BoardService _boardService;
    
    public BoardController(BoardService boardService, ILogger<BoardController> logger)
    {
        _boardService = boardService;
        
        logger.Log(LogLevel.Information, "Board controller initialized");
    }

    [HttpPost]
    public async Task<IActionResult> CreateBoard(int projectId, [FromBody] BoardPostDto boardPostDto)
    {
        try
        {
            Board? board = await _boardService.CreateBoard(projectId, boardPostDto);
            if (board == null) return NotFound();
            return Ok(board);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateBoard(int projectId, [FromBody] BoardPutDto boardPutDto)
    {
        try
        {
            Board? board = await _boardService.UpdateBoard(projectId, boardPutDto);
            if (board == null) return NotFound();
            return Ok(board);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteBoard(int projectId, int boardId)
    {
        try
        {
            bool removed = await _boardService.DeleteBoard(projectId, boardId);
            if (!removed) return NotFound();
            return Ok();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetBoards(int projectId)
    {
        try
        {
            List<Board> boards = await _boardService.GetBoards(projectId);
            if (boards.Count == 0) return NoContent();
            return Ok(boards);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}