using ArhiTodo.Models.DTOs.Accounts;
using Microsoft.AspNetCore.Identity;

namespace ArhiTodo.Interfaces;

public interface IUserRepository
{
    Task<IdentityResult> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto);
}