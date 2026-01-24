using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Authorize]
[ApiController]
[Route("api")]
public class BoardController(IBoardService boardService, ILabelService labelService) : ControllerBase
{
    [HttpPost("board/{boardId:int}/label")]
    public async Task<IActionResult> CreateLabel(int boardId, [FromBody] LabelCreateDto labelCreateDto)
    {
        LabelGetDto? label = await labelService.CreateLabel(boardId, labelCreateDto);
        if (label == null) return NotFound();
        return Ok(label);
    }
    
    [HttpPut("board/{boardId:int}/label/")]
    public async Task<IActionResult> UpdateLabel(int boardId, [FromBody] LabelUpdateDto labelUpdateDto)
    {
        LabelGetDto? labelGetDto = await labelService.UpdateLabel(boardId, labelUpdateDto);
        if (labelGetDto == null) return NotFound();
        return Ok(labelGetDto);
    }

    [HttpDelete("board/{boardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> DeleteLabel(int boardId, int labelId)
    {
        bool succeeded = await labelService.DeleteLabel(boardId, labelId);
        if (!succeeded) return NotFound();
        return NoContent();
    }

    [HttpGet("board/{boardId:int}/label")]
    public async Task<IActionResult> GetLabels(int boardId)
    {
        List<LabelGetDto> labels = await labelService.GetEveryLabel(boardId);
        return Ok(labels);
    } 
    
    [HttpPost("project/{projectId:int}/board/")]
    public async Task<IActionResult> CreateBoard(int projectId, [FromBody] BoardCreateDto boardCreateDto)
    {
        BoardGetDto? board = await boardService.CreateBoard(projectId, boardCreateDto);
        if (board == null) return NotFound();
        return Ok(board);
    }

    [HttpPut("project/{projectId:int}/board/")]
    public async Task<IActionResult> UpdateBoard(int projectId, [FromBody] BoardUpdateDto boardUpdateDto)
    {
        BoardGetDto? board = await boardService.UpdateBoard(projectId, boardUpdateDto);
        if (board == null) return NotFound();
        return Ok(board);
    }

    [HttpDelete("project/{projectId:int}/board/{boardId:int}")]
    public async Task<IActionResult> DeleteBoard(int projectId, int boardId)
    {
        bool removed = await boardService.DeleteBoard(projectId, boardId);
        if (!removed) return NotFound();
        return NoContent();
    }

    [HttpGet("project/{projectId:int}/board/")]
    public async Task<IActionResult> GetBoards(int projectId)
    {
        List<BoardGetDto> boards = await boardService.GetEveryBoard(projectId);
        return Ok(boards);
    }

    [HttpGet("project/{projectId:int}/board/{boardId:int}")]
    public async Task<IActionResult> GetBoard(int projectId, int boardId)
    {
        BoardGetDto? boardGetDto = await boardService.GetBoard(boardId);
        if (boardGetDto == null) return NotFound();
        
        List<LabelGetDto> labels = await labelService.GetEveryLabel(boardId);
        return Ok(new { board = boardGetDto, labels });
    }
}