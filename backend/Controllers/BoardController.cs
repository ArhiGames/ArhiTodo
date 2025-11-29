using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Put;
using ArhiTodo.Services;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api")]
public class BoardController : ControllerBase
{
    private readonly BoardService _boardService;
    
    public BoardController(BoardService boardService, ILogger<BoardController> logger)
    {
        _boardService = boardService;
        
        logger.Log(LogLevel.Information, "Board controller initialized");
    }

    [HttpPost("/project/{projectId:int}/board/")]
    public async Task<IActionResult> CreateBoard(int projectId, [FromBody] BoardPostDto boardPostDto)
    {
        try
        {
            Board? board = await _boardService.CreateBoard(projectId, boardPostDto);
            if (board == null) return NotFound();
            return Ok(new { board.BoardId } );
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
            Board? board = await _boardService.UpdateBoard(projectId, boardPutDto);
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
            bool removed = await _boardService.DeleteBoard(projectId, boardId);
            if (!removed) return NotFound();
            return Ok();
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
            List<Board> boards = await _boardService.GetBoards(projectId);
            if (boards.Count == 0) return NoContent();

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
            Board? board = await _boardService.GetBoard(projectId, boardId);
            if (board == null) return NotFound();

            BoardGetDto boardGetDto = new()
            {
                BoardName = board.BoardName,
                BoardId = board.BoardId,
                CardLists = board.CardLists.Select(cl => new CardListGetDto()
                {
                    CardListName = cl.CardListName,
                    CardListId = cl.CardListId,
                    Cards = cl.Cards.Select(c => new CardGetDto()
                    {
                        CardName = c.CardName,
                        CardId = c.CardId
                    }).ToList()
                }).ToList()
            };
            
            return Ok(boardGetDto);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}