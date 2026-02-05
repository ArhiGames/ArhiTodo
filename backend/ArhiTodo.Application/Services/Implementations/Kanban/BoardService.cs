using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class BoardService(IBoardNotificationService boardNotificationService, IBoardRepository boardRepository,
    IUnitOfWork unitOfWork, ICurrentUser currentUser) : IBoardService
{
    public async Task<List<ClaimGetDto>?> UpdateBoardUserClaim(int boardId, Guid userId, List<ClaimPostDto> claimPostDtos)
    {
        Board? board = await boardRepository.GetAsync(boardId, false);
        if (board == null) return null;
        
        foreach (ClaimPostDto claimPostDto in claimPostDtos)
        {
            bool succeeded = Enum.TryParse(claimPostDto.ClaimType, out BoardClaims boardClaim);
            if (!succeeded) return null;
            board.UpdateUserClaim(boardClaim, claimPostDto.ClaimValue);
        }

        await unitOfWork.SaveChangesAsync();
        return board.BoardUserClaims.Select(bc => bc.ToGetDto()).ToList();
    }

    public async Task<List<UserGetDto>> GetBoardMembers(int boardId)
    {
        List<User> boardMembers = await boardRepository.GetBoardMembers(boardId);
        return boardMembers.Select(bm => bm.ToGetDto()).ToList();
    }

    public async Task<List<UserGetDto>?> UpdateBoardMemberStatus(int boardId, List<BoardMemberStatusUpdateDto> boardMemberStatusUpdateDtos)
    {
        Board? board = await boardRepository.GetAsync(boardId);
        if (board == null) return null;
        
        foreach (BoardMemberStatusUpdateDto boardMemberStatusUpdateDto in boardMemberStatusUpdateDtos)
        {
            if (boardMemberStatusUpdateDto.NewMemberState)
            {
                board.AddMember(boardMemberStatusUpdateDto.UserId);
            }
            else
            {
                board.RemoveMember(boardMemberStatusUpdateDto.UserId);
            }
        }

        await unitOfWork.SaveChangesAsync();
        return await GetBoardMembers(boardId);
    }

    public async Task<BoardGetDto?> CreateBoard(int projectId, BoardCreateDto boardCreateDto)
    {
        Board board = new(projectId, boardCreateDto.BoardName, currentUser.UserId);
        await unitOfWork.SaveChangesAsync();
        
        board.AddMember(currentUser.UserId);
        foreach (BoardClaims boardClaim in Enum.GetValuesAsUnderlyingType<BoardClaims>())
        {
            board.AddUserClaim(boardClaim, "true", currentUser.UserId);
        }
        
        BoardGetDto boardGetDto = board.ToGetDto();
        boardNotificationService.CreateBoard(Guid.NewGuid(), projectId, boardGetDto);
        return boardGetDto;
    }

    public async Task<BoardGetDto?> UpdateBoard(int projectId, BoardUpdateDto boardUpdateDto)
    {
        Board? board = await boardRepository.GetAsync(boardUpdateDto.BoardId);
        if (board == null) return null;
        
        board.ChangeName(boardUpdateDto.BoardName);
        await unitOfWork.SaveChangesAsync();
        
        BoardGetDto boardGetDto = board.ToGetDto();
        boardNotificationService.UpdateBoard(Guid.NewGuid(), projectId, boardGetDto);
        return boardGetDto;
    }

    public async Task<bool> DeleteBoard(int projectId, int boardId)
    {
        bool succeeded = await boardRepository.DeleteAsync(boardId);
        if (succeeded)
        {
            boardNotificationService.DeleteBoard(Guid.NewGuid(), projectId, boardId);
        }
        return succeeded;
    }

    public async Task<List<BoardGetDto>> GetEveryBoard(int projectId)
    {
        List<Board> boards = await boardRepository.GetAllAsync(projectId);
        return boards.Select(b => b.ToGetDto()).ToList();
    }

    public async Task<BoardGetDto?> GetBoard(int boardId)
    {
        Board? board = await boardRepository.GetAsync(boardId);
        return board?.ToGetDto();
    }
}