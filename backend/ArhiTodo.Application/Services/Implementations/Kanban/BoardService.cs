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
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Auth;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class BoardService(IBoardNotificationService boardNotificationService, IProjectRepository projectRepository, IBoardRepository boardRepository,
    IAuthorizationService authorizationService, IUnitOfWork unitOfWork, IAccountRepository accountRepository, ICurrentUser currentUser) : IBoardService
{
    private async Task<Result> CanPerformActionWithPermission(Board board, BoardClaimTypes boardClaimType)
    {
        bool mayModifyProjectsGlobally =
            await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        if (mayModifyProjectsGlobally) return Result.Success();
        
        bool isOwner = board.OwnerId == currentUser.UserId;
        bool hasSpecifiedPermission = board.HasClaim(boardClaimType, "true", currentUser.UserId);
        bool isProjectMember = board.Project.IsProjectMember(currentUser.UserId);
        if (!isOwner && !hasSpecifiedPermission && !isProjectMember)
        {
            return new Error(nameof(boardClaimType), ErrorType.Forbidden,
                $"You need to be a project manager or have the claim {nameof(boardClaimType)} set to true!");
        }

        return Result.Success();
    }
    
    public async Task<Result<List<ClaimGetDto>>> UpdateBoardUserClaim(int boardId, Guid userId, List<ClaimPostDto> claimPostDtos)
    {
        Board? board = await boardRepository.GetAsync(boardId, true);
        if (board is null) return Errors.NotFound;

        Result canManageBoardResult = await CanPerformActionWithPermission(board, BoardClaimTypes.ManageUsers);
        if (!canManageBoardResult.IsSuccess) return canManageBoardResult.Error!;
        
        foreach (ClaimPostDto claimPostDto in claimPostDtos)
        {
            bool succeeded = Enum.TryParse(claimPostDto.ClaimType, out BoardClaimTypes boardClaimType);
            if (!succeeded) return new Error("InvalidClaimType", ErrorType.BadRequest, "Invalid board claim type!");
            board.AddOrUpdateUserClaim(boardClaimType, claimPostDto.ClaimValue, userId);
        }

        await unitOfWork.SaveChangesAsync();
        return board.BoardUserClaims.Where(bc => bc.UserId == userId).Select(bc => bc.ToGetDto()).ToList();
    }

    public async Task<Result<List<UserGetDto>>> GetBoardMembers(int boardId)
    {
        Board? board = await boardRepository.GetAsync(currentUser.UserId, boardId, true);
        if (board is null) return Errors.NotFound;
        
        Result canManageBoardResult = await CanPerformActionWithPermission(board, BoardClaimTypes.ManageUsers);
        if (!canManageBoardResult.IsSuccess) return canManageBoardResult.Error!;

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

    public async Task<Result<List<UserGetDto>>> UpdateBoardMemberStatus(int boardId, 
        List<BoardMemberStatusUpdateDto> boardMemberStatusUpdateDtos)
    {
        Board? board = await boardRepository.GetAsync(boardId, true);
        if (board is null) return Errors.NotFound;

        Result canManageBoardUsersResult = await CanPerformActionWithPermission(board, BoardClaimTypes.ManageUsers);
        if (!canManageBoardUsersResult.IsSuccess) return canManageBoardUsersResult.Error!;
        
        foreach (BoardMemberStatusUpdateDto boardMemberStatusUpdateDto in boardMemberStatusUpdateDtos)
        {
            if (boardMemberStatusUpdateDto.NewMemberState)
            {
                Result addMemberResult = board.AddMember(boardMemberStatusUpdateDto.UserId);
                if (!addMemberResult.IsSuccess) return addMemberResult.Error!;
            }
            else
            {
                board.RemoveMember(boardMemberStatusUpdateDto.UserId);
            }
        }

        await unitOfWork.SaveChangesAsync();
        return await GetBoardMembers(boardId);
    }

    public async Task<Result<BoardGetDto>> CreateBoard(int projectId, BoardCreateDto boardCreateDto)
    {
        Project? project = await projectRepository.GetAsync(projectId);
        if (project is null) return Errors.NotFound;

        bool mayManageProjectsGlobally =
            await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        if (!mayManageProjectsGlobally)
        {
            bool isProjectManager = project.IsProjectMember(currentUser.UserId);
            if (!isProjectManager)
            {
                return new Error("CreateBoard", ErrorType.Forbidden,
                    "You need to be a project manager to create a board!");
            }
        }

        Result<Board> createBoardResult = Board.Create(projectId, boardCreateDto.BoardName, currentUser.UserId);
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
        Board? board = await boardRepository.GetAsync(boardUpdateDto.BoardId, true);
        if (board == null) return Errors.NotFound;

        Result mayUpdateBoard = await CanPerformActionWithPermission(board, BoardClaimTypes.ManageBoard);
        if (!mayUpdateBoard.IsSuccess) return mayUpdateBoard.Error!;
        
        Result changeBoardNameResult = board.ChangeName(boardUpdateDto.BoardName);
        if (!changeBoardNameResult.IsSuccess) return changeBoardNameResult.Error!;
        await unitOfWork.SaveChangesAsync();
        
        BoardGetDto boardGetDto = board.ToGetDto();
        boardNotificationService.UpdateBoard(projectId, boardGetDto);
        return boardGetDto;
    }

    public async Task<Result> DeleteBoard(int projectId, int boardId)
    {
        Board? board = await boardRepository.GetAsync(boardId, true);
        if (board is null) return Errors.NotFound;

        bool mayDeleteBoardGlobally =
            await authorizationService.CheckPolicy(nameof(UserClaimTypes.DeleteOthersProjects));
        if (!mayDeleteBoardGlobally)
        {
            bool isBoardOwner = board.OwnerId == currentUser.UserId;
            bool isProjectManager = board.Project.IsProjectMember(currentUser.UserId);
            if (!isBoardOwner && !isProjectManager)
            {
                return new Error("DeleteBoard", ErrorType.Forbidden,
                    "You can only delete boards if you're a project manager or the board owner!");
            }
        }
        
        Result removeBoardResult = board.Project.RemoveBoard(boardId);
        await unitOfWork.SaveChangesAsync();
        
        if (removeBoardResult.IsSuccess)
        {
            boardNotificationService.DeleteBoard(projectId, boardId);
        }
        return removeBoardResult;
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
        Board? board;
        
        bool mayEditProjectsGlobally =
            await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        if (mayEditProjectsGlobally)
        {
            board = await boardRepository.GetAsync(boardId, false, IBoardRepository.BoardIncludeData.ChecklistItems);
        }
        else
        {
            board = await boardRepository.GetAsync(currentUser.UserId, boardId, false, IBoardRepository.BoardIncludeData.ChecklistItems);
        }
        
        return  board is null ? Errors.NotFound : board.ToGetDto();
    }
}