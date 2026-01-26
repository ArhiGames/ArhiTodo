using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;
using ArhiTodo.Domain.Services.Auth;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class AuthService(IUserRepository userRepository, ITokenService tokenService, 
    IJwtTokenGeneratorService jwtTokenGeneratorService, IPasswordHashService passwordHashService,
    ITokenGeneratorService tokenGeneratorService, IInvitationService invitationService, IPasswordAuthorizer passwordAuthorizer) : IAuthService
{
    public async Task<PasswordAuthorizerResult> CreateAccount(CreateAccountDto createAccountDto)
    {
        PasswordAuthorizerResult passwordAuthorizerResult =
            passwordAuthorizer.VerifyPasswordSecurity(createAccountDto.Password);
        if (!passwordAuthorizerResult.Succeeded)
        {
            return passwordAuthorizerResult;
        }
        
        InvitationLink? invitationLink = await invitationService.GetUsableInvitationLink(createAccountDto.InvitationKey);
        if (invitationLink == null) return new PasswordAuthorizerResult(false, []);
        
        string hashedPassword = passwordHashService.Hash(createAccountDto.Password);

        User user = new()
        {
            UserName = createAccountDto.Username,
            Email = createAccountDto.Email,
            HashedPassword = hashedPassword,
            JoinedViaInvitationKey = createAccountDto.InvitationKey
        };

        User? createdUser = await userRepository.CreateUserAsync(invitationLink, user);
        return new PasswordAuthorizerResult(createdUser != null, []);
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

    public async Task<PasswordAuthorizerResult> ChangePassword(ClaimsPrincipal user, UpdatePasswordDto updatePasswordDto)
    {
        PasswordAuthorizerResult passwordAuthorizerResult =
            passwordAuthorizer.VerifyPasswordSecurity(updatePasswordDto.NewPassword);
        if (!passwordAuthorizerResult.Succeeded)
        {
            return passwordAuthorizerResult;
        }
            
        Claim? userId = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userId == null) return new PasswordAuthorizerResult(false, []);

        Guid guid = Guid.Parse(userId.Value);

        User? foundUser = await userRepository.GetUserByGuidAsync(guid);
        if (foundUser == null) return new PasswordAuthorizerResult(false, []);

        bool isCorrectPassword = passwordHashService.Verify(updatePasswordDto.OldPassword, foundUser.HashedPassword);
        if (!isCorrectPassword) return new PasswordAuthorizerResult(false, []);

        string hashedPassword = passwordHashService.Hash(updatePasswordDto.NewPassword);
        bool succeeded = await userRepository.ChangePassword(guid, hashedPassword);

        await LogoutEveryDevice(guid);
        
        return new PasswordAuthorizerResult(succeeded, []);
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

    public async Task<bool> Logout(ClaimsPrincipal user, string userAgent)
    {
        Claim? userId = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userId == null) return false;

        Guid guid = Guid.Parse(userId.Value); 
        
        UserSession? userSession = await userRepository.GetUserSessionByAgent(guid, userAgent);
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