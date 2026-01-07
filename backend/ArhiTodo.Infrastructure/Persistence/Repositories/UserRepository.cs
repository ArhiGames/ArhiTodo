using System.Security.Claims;
using ArhiTodo.Domain.Repositories;
using ArhiTodo.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly UserManager<AppUser> _userManager;

    public UserRepository(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<bool> ChangePasswordAsync(AppUser appUser, ChangePasswordDto changePasswordDto)
    {
        IdentityResult identityResult = await _userManager.ChangePasswordAsync(appUser, changePasswordDto.OldPassword, changePasswordDto.NewPassword);
        return identityResult.Succeeded;
    }

    public async Task<List<UserUserManagementGetDto>> GetAllUsersAsync()
    {
        List<AppUser> users = await _userManager.Users.ToListAsync();

        IEnumerable<UserUserManagementGetDto> userManagementGetDtos = users.Select(u => new UserUserManagementGetDto
        {
            UserId = u.Id,
            UserName = u.UserName!,
            Email = string.IsNullOrEmpty(u.Email) ? "" : u.Email
        });

        return userManagementGetDtos.ToList();
    }

    public async Task<int> UpdateUserClaims(AppUser appUser, List<ClaimPostDto> updatedClaims)
    {
        IList<Claim> currentClaims = await _userManager.GetClaimsAsync(appUser);
        int changedClaims = 0;
        
        foreach (ClaimPostDto newClaim in updatedClaims)
        {
            Claim? existingClaim = currentClaims.FirstOrDefault(claim => claim.Type == newClaim.Type);
            if (existingClaim == null)
            {
                IdentityResult identityResult = await _userManager.AddClaimAsync(appUser, new Claim(newClaim.Type, newClaim.Value));
                if (identityResult.Succeeded) changedClaims++;
            }
            else
            {
                if (existingClaim.Value == newClaim.Value) continue;
                
                IdentityResult identityResult = await _userManager.ReplaceClaimAsync(appUser, existingClaim, new Claim(newClaim.Type, newClaim.Value));
                if (identityResult.Succeeded) changedClaims++;
            }
        }

        return changedClaims;
    }

    public async Task<UserUserManagementGetDto> GetUserWithClaimsAsync(AppUser appUser)
    {
        IList<Claim> claims = await _userManager.GetClaimsAsync(appUser);
        UserUserManagementGetDto userManagementGetDto = new()
        {
            UserId = appUser.Id,
            UserName = appUser.UserName!,
            Email = appUser.Email!,
            UserClaims = claims.Select(c => new ClaimGetDto
            {
                Type = c.Type,
                Value = c.Value
            }).ToList()
        };

        return userManagementGetDto;
    }

    public async Task<bool> DeleteAppUser(AppUser appUser)
    {
        IdentityResult identityResult = await _userManager.DeleteAsync(appUser);
        return identityResult.Succeeded;
    }
}