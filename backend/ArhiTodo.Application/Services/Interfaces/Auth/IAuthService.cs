using ArhiTodo.Application.DTOs.Auth;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface IAuthService
{
    Task<PasswordAuthorizerResult> CreateAccount(CreateAccountDto createAccountDto);
    Task<bool> DeleteAccount(Guid userId);
    Task<LoginGetDto?> Login(LoginDto loginDto, string userAgent);
    Task<PasswordAuthorizerResult> ChangePassword(UpdatePasswordDto updatePasswordDto);
    Task<UserGetDto?> GetUser(Guid guid);
    Task<List<UserGetDto>> GetUsers(int page, bool includeGlobalPermissions, int? boardPermissionsBoardId);
    Task<int> GetUserCount();
    
    Task<string?> RefreshJwtToken(string refreshToken);
    Task<bool> Logout(string userAgent);
    Task<bool> LogoutEveryDevice(Guid userId);
}