using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;
using ArhiTodo.Domain.Services.Auth;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class AuthService(IUserRepository userRepository, ITokenService tokenService, 
    IJwtTokenGeneratorService jwtTokenGeneratorService, IPasswordHashService passwordHashService,
    ITokenGeneratorService tokenGeneratorService) : IAuthService
{
    public async Task<bool> CreateAccount(CreateAccountDto createAccountDto)
    {
        string hashedPassword = passwordHashService.Hash(createAccountDto.Password);

        User user = new()
        {
            UserName = createAccountDto.Username,
            Email = createAccountDto.Email,
            HashedPassword = hashedPassword
        };

        User? createdUser = await userRepository.CreateUserAsync(user);
        return createdUser != null;
    }

    public async Task<LoginGetDto?> Login(LoginDto loginDto, string userAgent)
    {
        User? user = await userRepository.GetUserByUsernameAsync(loginDto.Username);
        if (user == null) return null;

        bool passwordCorrect = passwordHashService.Verify(loginDto.Password, user.HashedPassword);
        if (!passwordCorrect) return null;

        string? refreshToken = await tokenService.GenerateRefreshTokenAndAddSessionEntry(user, userAgent);
        if (refreshToken == null) return null;

        string jwt = jwtTokenGeneratorService.GenerateToken(user, new List<Claim>());
        return new LoginGetDto(jwt, refreshToken);
    }

    public async Task<string?> RefreshJwtToken(string refreshToken)
    {
        byte[] byteToken = Convert.FromHexString(refreshToken);
        string hashedToken = tokenGeneratorService.Hash(byteToken, 32);
        
        UserSession? userSession = await userRepository.GetUserSessionByToken(hashedToken);
        if (userSession == null) return null;
        
        User user = userSession.User;
        string jwt = jwtTokenGeneratorService.GenerateToken(user, new List<Claim>());
        return jwt;
    }

    public async Task<bool> Logout(Guid userId, string userAgent)
    {
        UserSession? userSession = await userRepository.GetUserSessionByAgent(userId, userAgent);
        if (userSession == null) return false;

        bool succeeded = await userRepository.InvalidateUserSession(userSession.SessionId);
        return succeeded;
    }

    public async Task<bool> LogoutEveryDevice(Guid userId)
    {
        bool succeeded = await userRepository.InvalidateUserSessions(userId);
        return succeeded;
    }
}