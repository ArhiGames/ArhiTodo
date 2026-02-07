using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Authentication;

public interface IAuthService
{
    Task<Result> CreateAccount(CreateAccountDto createAccountDto);
    Task<Result<LoginGetDto>> Login(LoginDto loginDto, string userAgent);
    Task<Result> ChangePassword(UpdatePasswordDto updatePasswordDto);
    Task<Result> DeleteAccount(Guid userId);
    
    Task<Result<string>> RefreshJwtToken(string refreshToken);
    Task<Result> Logout(string userAgent);
    Task<Result> LogoutEveryDevice(Guid userId);
}