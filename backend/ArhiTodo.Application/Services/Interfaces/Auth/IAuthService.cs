using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface IAuthService
{
    Task<bool> CreateAccount(CreateAccountDto createAccountDto);
    Task<LoginGetDto?> Login(LoginDto loginDto, string userAgent);
    Task<bool> ChangePassword(ClaimsPrincipal user, UpdatePasswordDto updatePasswordDto);
    Task<string?> RefreshJwtToken(string refreshToken);
    Task<bool> Logout(ClaimsPrincipal user, string userAgent);
    Task<bool> LogoutEveryDevice(Guid userId);
}