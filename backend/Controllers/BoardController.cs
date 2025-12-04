using ArhiTodo.Interfaces;
using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Put;
using ArhiTodo.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api")]
public class BoardController : ControllerBase
{
    private readonly IBoardRepository _boardRepository;
    
    public BoardController(IBoardRepository boardRepository, ILogger<BoardController> logger)
    {
        _boardRepository = boardRepository;
        
        logger.Log(LogLevel.Information, "Board controller initialized");
    }

    [HttpPost("/project/{projectId:int}/board/")]
    public async Task<IActionResult> CreateBoard(int projectId, [FromBody] BoardPostDto boardPostDto)
    {
        try
        {
            Board? board = await _boardRepository.CreateAsync(projectId, boardPostDto);
            if (board == null) return NotFound();
            return CreatedAtAction(nameof(GetBoard), new { projectId, boardId = board.BoardId }, board.ToBoardGetDto());
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpPut("/project/{projectId:int}/board/")]
    public async Task<IActionResult> UpdateBoard(int projectId, [FromBody] BoardPutDto boardPutDto)
    {
        try
        {
            Board? board = await _boardRepository.UpdateAsync(projectId, boardPutDto);
            if (board == null) return NotFound();
            return Ok(new { board.BoardId} );
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpDelete("/project/{projectId:int}/board/{boardId:int}")]
    public async Task<IActionResult> DeleteBoard(int projectId, int boardId)
    {
        try
        {
            bool removed = await _boardRepository.DeleteAsync(projectId, boardId);
            if (!removed) return NotFound();
            return NoContent();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpGet("project/{projectId:int}/board/")]
    public async Task<IActionResult> GetBoards(int projectId)
    {
        try
        {
            List<Board> boards = await _boardRepository.GetAllAsync(projectId);
            if (boards.Count == 0) return NotFound();

            List<BoardGetDto> boardGetDtos = boards.Select(board => new BoardGetDto() { BoardId = board.BoardId, BoardName = board.BoardName }).ToList();
            return Ok(boardGetDtos);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpGet("project/{projectId:int}/board/{boardId:int}")]
    public async Task<IActionResult> GetBoard(int projectId, int boardId)
    {
        try
        {
            Board? board = await _boardRepository.GetAsync(projectId, boardId);
            if (board == null) return NotFound();

            BoardGetDto boardGetDto = board.ToBoardGetDto();
            return Ok(boardGetDto);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}