using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Authorization;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Authentication;

public class UserService(IUnitOfWork unitOfWork, IAccountRepository accountRepository, IAuthorizationService authorizationService, 
    IBoardRepository boardRepository) : IUserService
{
    public async Task<Result<List<ClaimGetDto>>> UpdateClaims(Guid userId, List<ClaimPostDto> claimPostDtos)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ManageUsers));
        if (!authorized) return Errors.Forbidden;
        
        User? user = await accountRepository.GetUserByGuidAsync(userId);
        if (user is null) return Errors.NotFound;

        foreach (ClaimPostDto claimPostDto in claimPostDtos)
        {
            bool succeededParsing = Enum.TryParse(claimPostDto.ClaimType, out UserClaimTypes userClaimType);
            if (!succeededParsing) continue;
            
            UserClaim? existingClaim = user.UserClaims.FirstOrDefault(uc => uc.Type == userClaimType);
            if (existingClaim is null)
            {
                Result addUserClaimResult = user.AddUserClaim(userClaimType, claimPostDto.ClaimValue);
                if (!addUserClaimResult.IsSuccess) return addUserClaimResult.Error!;
            }
            else
            {
                Result changeUserClaimResult = user.ChangeClaimValue(userClaimType, claimPostDto.ClaimValue);
                if (!changeUserClaimResult.IsSuccess) return changeUserClaimResult.Error!;
            }
        }

        await unitOfWork.SaveChangesAsync();
        return user.UserClaims.Select(uc => uc.ToGetDto()).ToList();
    }

    public async Task<Result<List<UserGetDto>>> GetUsers(int page, bool includeGlobalPermissions, int? boardPermissionsBoardId)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ManageUsers));
        if (!authorized) return Errors.Forbidden;
        
        List<User> users = await accountRepository.GetUsers(page, includeGlobalPermissions);
        List<UserGetDto> userGetDtos = users.Select(u => u.ToGetDto()).ToList();

        if (boardPermissionsBoardId == null) return userGetDtos;
        
        List<BoardUserClaim> boardUserClaims = await boardRepository.GetBoardPermissions(boardPermissionsBoardId.Value);
        foreach (BoardUserClaim boardUserClaim in boardUserClaims)
        {
            UserGetDto? foundUser = userGetDtos.FirstOrDefault(u => u.UserId == boardUserClaim.UserId);
            foundUser?.BoardUserClaims.Add(boardUserClaim.ToGetDto());
        }

        return userGetDtos;
    }

    public async Task<Result<int>> GetUserCount()
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ManageUsers));
        if (!authorized) return Errors.Forbidden;
        
        return await accountRepository.GetUserCount();
    }

    public async Task<Result<UserGetDto>> GetUser(Guid guid)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ManageUsers));
        if (!authorized) return Errors.Forbidden;
        
        User? user = await accountRepository.GetUserByGuidAsync(guid);
        return user is null ? Errors.NotFound : user.ToGetDto();
    }
}