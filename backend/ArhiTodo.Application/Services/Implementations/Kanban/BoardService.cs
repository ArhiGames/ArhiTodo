using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Authorization;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Authentication;
using ArhiTodo.Domain.Repositories.Authorization;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class BoardService(IBoardNotificationService boardNotificationService, IBoardRepository boardRepository,
    IAuthorizationService authorizationService, IBoardAuthorizer boardAuthorizer, IUnitOfWork unitOfWork, 
    IAccountRepository accountRepository, ICurrentUser currentUser) : IBoardService
{
    public async Task<Result<List<ClaimGetDto>>> UpdateBoardUserClaim(int boardId, Guid userId, List<ClaimPostDto> claimPostDtos)
    {
        if (userId == currentUser.UserId)
        {
            return new Error("SelfEditing", ErrorType.Forbidden,
                "You cannot edit your own claims!");
        }
        
        bool hasBoardManageUsersPermission = await boardAuthorizer.HasBoardEditUsersPermission(boardId);
        if (!hasBoardManageUsersPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId);
        if (board is null) return Errors.NotFound;
        
        foreach (ClaimPostDto claimPostDto in claimPostDtos)
        {
            bool succeeded = Enum.TryParse(claimPostDto.ClaimType, out BoardClaimTypes boardClaimType);
            if (!succeeded) return new Error("InvalidClaimType", ErrorType.BadRequest, "Invalid board claim type!");
            
            Result addOrUpdateUserClaimResult = board.AddOrUpdateUserClaim(boardClaimType, claimPostDto.ClaimValue, userId);
            if (!addOrUpdateUserClaimResult.IsSuccess) return addOrUpdateUserClaimResult.Error!;
        }

        await unitOfWork.SaveChangesAsync();

        List<ClaimGetDto> boardUserClaims = board.BoardUserClaims.Where(buc => buc.UserId == userId).Select(buc => buc.ToGetDto()).ToList();
        boardNotificationService.UpdateUserBoardPermissions(userId, boardId, boardUserClaims);
        
        return board.BoardUserClaims.Where(bc => bc.UserId == userId).Select(bc => bc.ToGetDto()).ToList();
    }

    public async Task<Result<List<UserGetDto>>> GetBoardMembers(int boardId)
    {
        bool hasBoardManageUsersPermission = await boardAuthorizer.HasBoardEditUsersPermission(boardId);
        if (!hasBoardManageUsersPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId);
        if (board is null) return Errors.NotFound;

        List<Guid> boardMemberIds = board.GetMemberIds();
        List<User> boardMembers = await accountRepository.GetUsersByGuidsAsync(boardMemberIds);
        
        List<UserGetDto> boardMemberGetDtos = [];
        foreach (User boardMember in boardMembers)
        {
            UserGetDto boardMemberGetDto = boardMember.ToGetDto();
            
            List<ClaimGetDto> boardUserClaims =
                board.BoardUserClaims.Where(buc => buc.UserId == boardMemberGetDto.UserId).Select(buc => buc.ToGetDto()).ToList();
            boardMemberGetDto.BoardUserClaims = boardUserClaims;
            
            boardMemberGetDtos.Add(boardMemberGetDto);
        }
        return boardMemberGetDtos;
    }

    public async Task<Result<List<PublicUserGetDto>>> GetPublicBoardMembers(int boardId)
    {
        bool hasBoardViewPermission = await boardAuthorizer.HasBoardViewPermission(boardId);
        if (!hasBoardViewPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId);
        if (board is null) return Errors.NotFound;

        List<Guid> boardMemberIds = board.GetMemberIds();
        List<User> boardMembers = await accountRepository.GetUsersByGuidsAsync(boardMemberIds);

        return boardMembers.Select(bm => bm.ToPublicGetDto()).ToList();
    }

    public async Task<Result<List<UserGetDto>>> UpdateBoardMemberStatus(int boardId, 
        List<BoardMemberStatusUpdateDto> boardMemberStatusUpdateDtos)
    {
        if (boardMemberStatusUpdateDtos.Any(buc => buc.UserId == currentUser.UserId))
        {
            return new Error("SelfEditing", ErrorType.Forbidden,
                "You cannot edit your own claims!");
        }
        
        bool hasBoardManageUsersPermission = await boardAuthorizer.HasBoardEditUsersPermission(boardId);
        if (!hasBoardManageUsersPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId, true);
        if (board is null) return Errors.NotFound;
        
        foreach (BoardMemberStatusUpdateDto boardMemberStatusUpdateDto in boardMemberStatusUpdateDtos)
        {
            if (boardMemberStatusUpdateDto.NewMemberState)
            {
                Result addMemberResult = board.AddMember(boardMemberStatusUpdateDto.UserId);
                if (!addMemberResult.IsSuccess) return addMemberResult.Error!;
            }
            else
            {
                Result removeMemberResult = board.RemoveMember(boardMemberStatusUpdateDto.UserId);
                if (!removeMemberResult.IsSuccess) return removeMemberResult.Error!;
            }
        }

        await unitOfWork.SaveChangesAsync();

        List<User> users =
            await accountRepository.GetUsersByGuidsAsync(boardMemberStatusUpdateDtos.
                Where(bm => bm.NewMemberState).Select(bm => bm.UserId).ToList());

        foreach (BoardMemberStatusUpdateDto boardMemberStatusUpdateDto in boardMemberStatusUpdateDtos)
        {
            List<ClaimGetDto> boardUserClaims = board.BoardUserClaims
                .Where(buc => buc.UserId == boardMemberStatusUpdateDto.UserId).Select(buc => buc.ToGetDto()).ToList();
            boardNotificationService.UpdateUserBoardPermissions(boardMemberStatusUpdateDto.UserId, boardId, boardUserClaims);
            if (boardMemberStatusUpdateDto.NewMemberState)
            {
                boardNotificationService.AddBoardMember(boardId, users.FirstOrDefault(u => u.UserId == boardMemberStatusUpdateDto.UserId)!.ToPublicGetDto());
            }
            else
            {
                boardNotificationService.RemoveBoardMember(boardId, boardMemberStatusUpdateDto.UserId);
            }
        }
        
        return await GetBoardMembers(boardId);
    }

    public async Task<Result<BoardGetDto>> CreateBoard(int projectId, BoardCreateDto boardCreateDto)
    {
        bool hasCreateBoardPermission = await boardAuthorizer.HasCreateBoardPermission(projectId);
        if (!hasCreateBoardPermission) return Errors.Forbidden;
        
        Result<Board> createBoardResult = Board.Create(projectId, boardCreateDto.BoardName, currentUser.UserId);
        if (!createBoardResult.IsSuccess) return createBoardResult.Error!;
            
        Board addedBoard = await boardRepository.CreateBoardAsync(createBoardResult.Value!);
        
        BoardGetDto boardGetDto = addedBoard.ToGetDto();
        boardNotificationService.CreateBoard(projectId, boardGetDto);
        return boardGetDto;
    }

    public async Task<Result<BoardGetDto>> UpdateBoard(int projectId, BoardUpdateDto boardUpdateDto)
    {
        bool hasBoardManageUsersPermission = await boardAuthorizer.HasBoardEditPermission(boardUpdateDto.BoardId);
        if (!hasBoardManageUsersPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardUpdateDto.BoardId);
        if (board == null) return Errors.NotFound;
        
        Result changeBoardNameResult = board.ChangeName(boardUpdateDto.BoardName);
        if (!changeBoardNameResult.IsSuccess) return changeBoardNameResult.Error!;
        await unitOfWork.SaveChangesAsync();
        
        BoardGetDto boardGetDto = board.ToGetDto();
        boardNotificationService.UpdateBoard(projectId, boardGetDto);
        return boardGetDto;
    }

    public async Task<Result> DeleteBoard(int projectId, int boardId)
    {
        bool hasBoardManageUsersPermission = await boardAuthorizer.HasBoardDeletePermission(boardId);
        if (!hasBoardManageUsersPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId);
        if (board is null) return Errors.NotFound;

        await boardRepository.RemoveBoardAsync(board);
        
        boardNotificationService.DeleteBoard(projectId, boardId);
        return Result.Success();
    }

    public async Task<Result<List<BoardGetDto>>> GetEveryBoard(int projectId)
    {
        List<Board> boards;
        
        bool mayEditProjectsGlobally =
            await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        if (mayEditProjectsGlobally)
        {
            boards = await boardRepository.GetAllAsync(projectId);
        }
        else
        {
            boards = await boardRepository.GetAllAsync(currentUser.UserId, projectId);
        }
        
        return boards.Select(b => b.ToGetDto()).ToList();
    }

    public async Task<Result<BoardGetDto>> GetBoard(int boardId)
    {
        bool hasBoardManageUsersPermission = await boardAuthorizer.HasBoardViewPermission(boardId);
        if (!hasBoardManageUsersPermission) return Errors.Forbidden;
        
        BoardGetDto? boardGetDto = await boardRepository.GetReadModelAsync(boardId); 
        return boardGetDto is null ? Errors.NotFound : boardGetDto;
    }

    public async Task<Result<List<ClaimGetDto>>> GetUserBoardClaims(int boardId)
    {
        bool hasBoardViewPermission = await boardAuthorizer.HasBoardViewPermission(boardId);
        if (!hasBoardViewPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId);
        if (board is null) return Errors.NotFound;

        return board.BoardUserClaims.Where(buc => buc.UserId == currentUser.UserId).Select(buc => buc.ToGetDto()).ToList();
    }
}