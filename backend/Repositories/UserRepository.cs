using System.Security.Claims;
using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Accounts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Repositories;

public class UserRepository : IUserRepository
{
    private readonly UserManager<AppUser> _userManager;

    public UserRepository(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<IdentityResult> ChangePasswordAsync(AppUser appUser, ChangePasswordDto changePasswordDto)
    {
        IdentityResult identityResult = await _userManager.ChangePasswordAsync(appUser, changePasswordDto.OldPassword, changePasswordDto.NewPassword);
        return identityResult;
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

    public async Task<int> UpdateUserClaims(string userId, List<ClaimPostDto> updatedClaims)
    {
        AppUser? appUser = await _userManager.FindByIdAsync(userId);
        if (appUser == null)
        {
            throw new InvalidOperationException();
        }
        
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

    public async Task<UserUserManagementGetDto> GetUserWithClaimsAsync(string userId)
    {
        AppUser? user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException();
        }
        
        IList<Claim> claims = await _userManager.GetClaimsAsync(user);
        UserUserManagementGetDto userManagementGetDto = new()
        {
            UserId = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            UserClaims = claims.Select(c => new ClaimGetDto
            {
                Type = c.Type,
                Value = c.Value
            }).ToList()
        };

        return userManagementGetDto;
    }
}