using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Kanban;

[Authorize]
[ApiController]
[Route("api")]
public class BoardController(IBoardService boardService) : ApiControllerBase
{
    [HttpPut("board/{boardId:int}/permissions/{userId:guid}")]
    public async Task<IActionResult> UpdateClaims(int boardId, Guid userId, [FromBody] List<ClaimPostDto> claimPostDto)
    {
        Result<List<ClaimGetDto>> claims = await boardService.UpdateBoardUserClaim(boardId, userId, claimPostDto);
        return claims.IsSuccess ? Ok(claims.Value) : HandleFailure(claims);
    }

    [HttpPut("board/{boardId:int}/members")]
    public async Task<IActionResult> UpdateMemberStatus(int boardId,
        [FromBody] List<BoardMemberStatusUpdateDto> boardMemberStatusUpdateDtos)
    {
        Result<List<UserGetDto>> userGetDtos = await boardService.UpdateBoardMemberStatus(boardId, boardMemberStatusUpdateDtos);
        return userGetDtos.IsSuccess ? Ok(userGetDtos.Value) : HandleFailure(userGetDtos);
    }

    [HttpGet("board/{boardId:int}/members")]
    public async Task<IActionResult> GetBoardMembers(int boardId)
    {
        Result<List<UserGetDto>> userGetDtos = await boardService.GetBoardMembers(boardId);
        return userGetDtos.IsSuccess ? Ok(userGetDtos.Value) : HandleFailure(userGetDtos);
    }
    
    [HttpPost("project/{projectId:int}/board/")]
    public async Task<IActionResult> CreateBoard(int projectId, [FromBody] BoardCreateDto boardCreateDto)
    {
        Result<BoardGetDto> board = await boardService.CreateBoard(projectId, boardCreateDto);
        return board.IsSuccess ? Ok(board.Value) : HandleFailure(board);
    }

    [HttpPut("project/{projectId:int}/board/")]
    public async Task<IActionResult> UpdateBoard(int projectId, [FromBody] BoardUpdateDto boardUpdateDto)
    {
        Result<BoardGetDto> board = await boardService.UpdateBoard(projectId, boardUpdateDto);
        return board.IsSuccess ? Ok(board.Value) : HandleFailure(board);
    }

    [HttpDelete("project/{projectId:int}/board/{boardId:int}")]
    public async Task<IActionResult> DeleteBoard(int projectId, int boardId)
    {
        Result deleteBoardResult = await boardService.DeleteBoard(projectId, boardId);
        return deleteBoardResult.IsSuccess ? NoContent() : HandleFailure(deleteBoardResult);
    }

    [HttpGet("project/{projectId:int}/board/")]
    public async Task<IActionResult> GetBoards(int projectId)
    {
        Result<List<BoardGetDto>> boards = await boardService.GetEveryBoard(projectId);
        return boards.IsSuccess ? Ok(boards.Value) : HandleFailure(boards);
    }

    [HttpGet("project/{projectId:int}/board/{boardId:int}")]
    public async Task<IActionResult> GetBoard(int projectId, int boardId)
    {
        Result<BoardGetDto> boardGetDto = await boardService.GetBoard(boardId);
        return boardGetDto.IsSuccess ? Ok(boardGetDto.Value) : HandleFailure(boardGetDto);
    }

    [HttpGet("project/{projectId:int}/board/{boardId:int}/permissions")]
    public async Task<IActionResult> GetBoardUserPermissions(int projectId, int boardId)
    {
        Result<List<ClaimGetDto>> boardUserClaimsResult = await boardService.GetUserBoardClaims(boardId);
        return boardUserClaimsResult.IsSuccess ? Ok(boardUserClaimsResult.Value) : HandleFailure(boardUserClaimsResult);
    }
}