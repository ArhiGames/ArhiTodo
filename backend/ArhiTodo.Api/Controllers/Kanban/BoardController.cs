using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Kanban;

[Authorize]
[ApiController]
[Route("api")]
public class BoardController(IBoardService boardService, ILabelService labelService) : ControllerBase
{
    [HttpPut("board/{boardId:int}/permissions/{userId:guid}")]
    public async Task<IActionResult> UpdateClaims(int boardId, Guid userId, [FromBody] List<ClaimPostDto> claimPostDto)
    {
        List<ClaimGetDto>? claims = await boardService.UpdateBoardUserClaim(boardId, userId, claimPostDto);
        if (claims == null) return NotFound();
        return Ok(claims);
    }

    [HttpPut("board/{boardId:int}/members")]
    public async Task<IActionResult> UpdateMemberStatus(int boardId,
        [FromBody] List<BoardMemberStatusUpdateDto> boardMemberStatusUpdateDtos)
    {
        List<UserGetDto>? userGetDtos = await boardService.UpdateBoardMemberStatus(boardId, boardMemberStatusUpdateDtos);
        if (userGetDtos == null) return NotFound();
        return Ok(userGetDtos);
    }

    [HttpGet("board/{boardId:int}/members")]
    public async Task<IActionResult> GetBoardMembers(int boardId)
    {
        List<UserGetDto> userGetDtos = await boardService.GetBoardMembers(boardId);
        return Ok(userGetDtos);
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
        
        List<LabelGetDto>? labels = await labelService.GetEveryLabel(boardId);
        return Ok(new { board = boardGetDto, labels });
    }
}