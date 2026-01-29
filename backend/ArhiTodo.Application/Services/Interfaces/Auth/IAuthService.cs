using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface IAuthService
{
    Task<PasswordAuthorizerResult> CreateAccount(CreateAccountDto createAccountDto);
    Task<LoginGetDto?> Login(LoginDto loginDto, string userAgent);
    Task<PasswordAuthorizerResult> ChangePassword(ClaimsPrincipal user, UpdatePasswordDto updatePasswordDto);
    Task<List<UserGetDto>> GetUsers(int page = 0);
    Task<UserGetDto?> GetUser(Guid guid);
    
    Task<string?> RefreshJwtToken(string refreshToken);
    Task<bool> Logout(ClaimsPrincipal user, string userAgent);
    Task<bool> LogoutEveryDevice(Guid userId);
}