using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Authorization;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authentication;
using ArhiTodo.Domain.Repositories.Common;

namespace ArhiTodo.Application.Services.Implementations.Authentication;

public class UserService(IUnitOfWork unitOfWork, IAccountRepository accountRepository, IAuthorizationService authorizationService, ICurrentUser currentUser) : IUserService
{
    public async Task<Result<List<ClaimGetDto>>> UpdateClaims(Guid userId, List<ClaimPostDto> claimPostDtos)
    {
        if (currentUser.UserId == userId)
        {
            return new Error("SelfEditing", ErrorType.Forbidden,
                "You cannot edit your own claims!");
        }
        
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ManageUsers));
        if (!authorized) return Errors.Forbidden;
            
        User? user = await accountRepository.GetUserByGuidAsync(userId);
        if (user is null) return Errors.NotFound;

        foreach (ClaimPostDto claimPostDto in claimPostDtos)
        {
            bool succeededParsing = Enum.TryParse(claimPostDto.ClaimType, out UserClaimTypes userClaimType);
            if (!succeededParsing) continue;

            Result changeUserClaimResult = user.ChangeClaimValue(userClaimType, claimPostDto.ClaimValue == true.ToString());
            if (!changeUserClaimResult.IsSuccess) return changeUserClaimResult.Error!;
        }

        await unitOfWork.SaveChangesAsync();
        return user.GetUserClaimsAsList().Select(uc => uc.ToGetDto()).ToList();
    }

    public async Task<Result<List<UserGetDto>>> GetUsers(int page)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ManageUsers));
        if (!authorized) return Errors.Forbidden;
        
        List<User> users = await accountRepository.GetUsers(page);
        List<UserGetDto> userGetDtos = users.Select(u => u.ToGetDto()).ToList();

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