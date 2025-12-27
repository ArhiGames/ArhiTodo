using ArhiTodo.Interfaces;
using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Post;
using ArhiTodo.Models.DTOs.Put;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Authorize]
[ApiController]
[Route("api")]
public class BoardController : ControllerBase
{
    private readonly IBoardRepository _boardRepository;
    private readonly ILabelRepository _labelRepository;
    
    public BoardController(IBoardRepository boardRepository, ILabelRepository labelRepository, ILogger<BoardController> logger)
    {
        _boardRepository = boardRepository;
        _labelRepository = labelRepository;
        
        logger.Log(LogLevel.Information, "Board controller initialized");
    }

    [HttpPost("project/{projectId:int}/board/{boardId:int}/label")]
    public async Task<IActionResult> CreateLabel(int projectId, int boardId, [FromBody] LabelPostDto labelPostDto)
    {
        try
        {
            Label? label = await _labelRepository.CreateLabelAsync(projectId, boardId, labelPostDto);
            if (label == null) return NotFound();
            return Ok(label.ToLabelGetDto());
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
    
    [HttpPut("project/{projectId:int}/board/{boardId:int}/label/")]
    public async Task<IActionResult> UpdateLabel(int projectId, int boardId, [FromBody] LabelPutDto labelPutDto)
    {
        Label? result = await _labelRepository.UpdateLabelAsync(projectId, boardId, labelPutDto);
        if (result == null) return NotFound();
        return Ok(result.ToLabelGetDto()); 
    }

    [HttpDelete("project/{projectId:int}/board/{boardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> DeleteLabel(int projectId, int boardId, int labelId)
    {
        bool result = await _labelRepository.DeleteLabelAsync(labelId);
        if (result)
        {
            return NoContent();
        }

        return NotFound();
    }

    [HttpGet("project/{projectId:int}/board/{boardId:int}/label")]
    public async Task<IActionResult> GetLabels(int projectId, int boardId)
    {
        try
        {
            List<Label> labels = await _labelRepository.GetAllAsync(boardId);
            List<LabelGetDto> labelGetDtos = labels.Select(l => l.ToLabelGetDto()).ToList();
            return Ok(labelGetDtos);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    } 
    
    [HttpPost("project/{projectId:int}/board/")]
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

    [HttpPut("project/{projectId:int}/board/")]
    public async Task<IActionResult> UpdateBoard(int projectId, [FromBody] BoardPutDto boardPutDto)
    {
        try
        {
            Board? board = await _boardRepository.UpdateAsync(projectId, boardPutDto);
            if (board == null) return NotFound();
            return Ok(board.ToBoardGetDto());
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpDelete("project/{projectId:int}/board/{boardId:int}")]
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
            if (boards.Count == 0) return Ok();

            List<BoardGetDto> boardGetDtos = boards.Select(board => board.ToBoardGetDto()).ToList();
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
            
            List<Label> labels = await _labelRepository.GetAllAsync(boardId);
            List<LabelGetDto> labelGetDtos = labels.Select(l => l.ToLabelGetDto()).ToList();
            
            BoardGetDto boardGetDto = board.ToBoardGetDto();
            return Ok(new { board = boardGetDto, labels = labelGetDtos });
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}