using ArhiTodo.Application.DTOs.Auth;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface IAuthService
{
    Task<bool> CreateAccount(CreateAccountDto createAccountDto);
    Task<LoginGetDto?> Login(LoginDto loginDto, string userAgent);
    Task<bool> Logout(Guid userId, string userAgent);
    Task<bool> LogoutEveryDevice(Guid userId);
}