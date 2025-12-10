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

    public async Task<UserUserManagementGetDto[]> GetAllUsersAsync()
    {
        List<AppUser> users = await _userManager.Users.ToListAsync();

        IEnumerable<Task<UserUserManagementGetDto>> userManagementGetDtos = users.Select(async u =>
        {
            IList<Claim> claims = await _userManager.GetClaimsAsync(u);
            return new UserUserManagementGetDto
            {
                UserId = u.Id,
                UserName = u.UserName!,
                Email = string.IsNullOrEmpty(u.Email) ? "" : u.Email,
                UserClaims = claims.Select(c => new ClaimGetDto
                {
                    Type = c.Type,
                    Value = c.Value
                }).ToList()
            };
        });

        return await Task.WhenAll(userManagementGetDtos);
    }
}