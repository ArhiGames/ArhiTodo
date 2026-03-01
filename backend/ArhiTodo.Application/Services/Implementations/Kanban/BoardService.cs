using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Authentication;
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
    IBoardAuthorizer boardAuthorizer, IUnitOfWork unitOfWork, IAccountRepository accountRepository, 
    ICurrentUser currentUser, IProjectRepository projectRepository) : IBoardService
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
            
            Result addOrUpdateUserClaimResult = board.AddOrUpdateUserClaim(boardClaimType, claimPostDto.ClaimValue == true.ToString(), userId);
            if (!addOrUpdateUserClaimResult.IsSuccess) return addOrUpdateUserClaimResult.Error!;
        }

        await unitOfWork.SaveChangesAsync();

        List<ClaimGetDto> boardUserClaims = board.BoardUserClaims.Where(buc => buc.UserId == userId).Select(buc => buc.ToGetDto()).ToList();
        boardNotificationService.UpdateUserBoardPermissions(userId, boardId, boardUserClaims);
        return boardUserClaims;
    }

    private static List<UserGetDto> RelateBoardUserClaimsToMember(Board board, List<User> boardMembers)
    {
        ILookup<Guid, ClaimGetDto> claimsLookup = board.BoardUserClaims
            .ToLookup(buc => buc.UserId, buc => buc.ToGetDto());

        return boardMembers.Select(member => 
        {
            UserGetDto dto = member.ToGetDto();
            dto.BoardUserClaims = claimsLookup[dto.UserId].ToList();
            return dto;
        }).ToList();
    }

    public async Task<Result<List<UserGetDto>>> GetBoardMembers(int boardId)
    {
        bool hasBoardManageUsersPermission = await boardAuthorizer.HasBoardEditUsersPermission(boardId);
        if (!hasBoardManageUsersPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId);
        if (board is null) return Errors.NotFound;

        List<Guid> boardMemberIds = board.GetMemberIds();
        List<User> boardMembers = await accountRepository.GetUsersByGuidsAsync(boardMemberIds);

        return RelateBoardUserClaimsToMember(board, boardMembers);
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

        List<Guid> addingUserIds =
            boardMemberStatusUpdateDtos.Where(bm => bm.NewMemberState).Select(bm => bm.UserId).ToList();
        List<Guid> removingUserIds =
            boardMemberStatusUpdateDtos.Where(bm => !bm.NewMemberState).Select(bm => bm.UserId).ToList();

        foreach (Guid addingUserId in addingUserIds)
        {
            Result addMemberResult = board.AddMember(addingUserId);
            if (!addMemberResult.IsSuccess) return addMemberResult.Error!;
        }
        foreach (Guid removingUserId in removingUserIds)
        {
            Result removeMemberResult = board.RemoveMember(removingUserId);
            if (!removeMemberResult.IsSuccess) return removeMemberResult.Error!;
        }

        await unitOfWork.SaveChangesAsync();
        await boardRepository.RemoveAssignedCardUsers(boardId, removingUserIds);

        List<User> addedUsers =
            await accountRepository.GetUsersByGuidsAsync(addingUserIds);

        foreach (BoardMemberStatusUpdateDto boardMemberStatusUpdateDto in boardMemberStatusUpdateDtos)
        {
            List<ClaimGetDto> boardUserClaims = board.BoardUserClaims
                .Where(buc => buc.UserId == boardMemberStatusUpdateDto.UserId).Select(buc => buc.ToGetDto()).ToList();
            boardNotificationService.UpdateUserBoardPermissions(boardMemberStatusUpdateDto.UserId, boardId, boardUserClaims);
            if (boardMemberStatusUpdateDto.NewMemberState)
            {
                boardNotificationService.AddBoardMember(boardId, addedUsers.FirstOrDefault(u => u.UserId == boardMemberStatusUpdateDto.UserId)!.ToPublicGetDto());
            }
            else
            {
                boardNotificationService.RemoveBoardMember(boardId, boardMemberStatusUpdateDto.UserId);
            }
        }
        
        List<Guid> boardMemberIds = board.GetMemberIds();
        List<User> boardMembers = await accountRepository.GetUsersByGuidsAsync(boardMemberIds);
        return RelateBoardUserClaimsToMember(board, boardMembers);
    }

    public async Task<Result<BoardGetDto>> CreateBoard(int projectId, BoardCreateDto boardCreateDto)
    {
        bool hasCreateBoardPermission = await boardAuthorizer.HasCreateBoardPermission(projectId);
        if (!hasCreateBoardPermission) return Errors.Forbidden;

        Project? project = await projectRepository.GetAsyncIncludingBoards(projectId);
        if (project is null) return Errors.NotFound;

        List<Board> sortedBoards = project.Boards.OrderBy(b => b.Position).ToList();
        
        Result<Board> createBoardResult = Board.Create(projectId, boardCreateDto.BoardName, currentUser.UserId, 
            sortedBoards.Count > 0 ? sortedBoards.Last().Position : null);
        if (!createBoardResult.IsSuccess) return createBoardResult.Error!;

        Result addBoardResult = project.AddBoard(createBoardResult.Value!);
        if (!addBoardResult.IsSuccess) return addBoardResult.Error!;

        await unitOfWork.SaveChangesAsync();
        
        BoardGetDto boardGetDto = createBoardResult.Value!.ToGetDto();
        boardNotificationService.CreateBoard(projectId, boardGetDto);
        return boardGetDto;
    }

    public async Task<Result<BoardGetDto>> UpdateBoard(int projectId, BoardUpdateDto boardUpdateDto)
    {
        bool hasBoardManageUsersPermission = await boardAuthorizer.HasBoardEditPermission(boardUpdateDto.BoardId);
        if (!hasBoardManageUsersPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardUpdateDto.BoardId);
        if (board is null) return Errors.NotFound;
        
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

        Project? project = await projectRepository.GetAsyncIncludingBoards(projectId);
        if (project is null) return Errors.NotFound;

        Result removeBoardResult = project.RemoveBoard(boardId);
        if (!removeBoardResult.IsSuccess) return removeBoardResult.Error!;

        await unitOfWork.SaveChangesAsync();
        
        boardNotificationService.DeleteBoard(projectId, boardId);
        return Result.Success();
    }

    public async Task<Result<List<BoardGetDto>>> GetEveryBoard(int projectId)
    {
        List<Board> boards = await boardRepository.GetAllAsync(currentUser.UserId, projectId);
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