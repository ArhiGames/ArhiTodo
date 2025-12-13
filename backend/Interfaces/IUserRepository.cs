using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Accounts;
using Microsoft.AspNetCore.Identity;

namespace ArhiTodo.Interfaces;

public interface IUserRepository
{
    Task<IdentityResult> ChangePasswordAsync(AppUser appUser, ChangePasswordDto changePasswordDto);
    Task<List<UserUserManagementGetDto>> GetAllUsersAsync();
    Task<UserUserManagementGetDto> GetUserWithClaimsAsync(string userId);
}