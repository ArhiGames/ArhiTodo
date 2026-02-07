using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using ArhiTodo.Domain.Repositories.Kanban;
using ArhiTodo.Domain.Services.Auth;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class AuthService(IBoardRepository boardRepository, IAccountRepository accountRepository, ISessionRepository sessionRepository, 
    ITokenService tokenService, IJwtTokenGeneratorService jwtTokenGeneratorService, IPasswordHashService passwordHashService,
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

        User user = new(createAccountDto.Username, createAccountDto.Email, hashedPassword,
            invitationLink.InvitationKey);
        User? createdUser = await accountRepository.CreateUserAsync(invitationLink, user);
        return new PasswordAuthorizerResult(createdUser != null, []);
    }

    public async Task<bool> DeleteAccount(Guid userId)
    {
        bool succeeded = await accountRepository.DeleteUserAsync(userId);
        return succeeded;
    }

    public async Task<LoginGetDto?> Login(LoginDto loginDto, string userAgent)
    {
        User? user = await accountRepository.GetUserByUsernameAsync(loginDto.Username, true);
        if (user == null) return null;

        bool passwordCorrect = passwordHashService.Verify(loginDto.Password, user.HashedPassword);
        if (!passwordCorrect) return null;

        string? refreshToken = await tokenService.GenerateRefreshTokenAndAddSessionEntry(user, userAgent);
        if (refreshToken == null) return null;
        
        List<Claim> claims = user.UserClaims.Select(uc => new Claim(uc.Type.ToString(), uc.Value)).ToList();
        string jwt = jwtTokenGeneratorService.GenerateToken(user, claims);
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

        User? foundUser = await accountRepository.GetUserByGuidAsync(guid);
        if (foundUser == null) return new PasswordAuthorizerResult(false, []);

        bool isCorrectPassword = passwordHashService.Verify(updatePasswordDto.OldPassword, foundUser.HashedPassword);
        if (!isCorrectPassword) return new PasswordAuthorizerResult(false, []);

        string hashedPassword = passwordHashService.Hash(updatePasswordDto.NewPassword);
        bool succeeded = await accountRepository.ChangePassword(guid, hashedPassword);

        await LogoutEveryDevice(guid);
        
        return new PasswordAuthorizerResult(succeeded, []);
    }

    public async Task<List<UserGetDto>> GetUsers(int page, bool includeGlobalPermissions, int? boardPermissionsBoardId)
    {
        List<User> users = await accountRepository.GetUsers(page, includeGlobalPermissions);
        List<UserGetDto> userGetDtos = users.Select(u => u.ToGetDto()).ToList();

        if (boardPermissionsBoardId == null) return userGetDtos;
        
        List<BoardUserClaim> boardUserClaims = await boardRepository.GetBoardPermissions(boardPermissionsBoardId.Value);
        foreach (BoardUserClaim boardUserClaim in boardUserClaims)
        {
            UserGetDto? foundUser = userGetDtos.FirstOrDefault(u => u.UserId == boardUserClaim.UserId);
            foundUser?.BoardUserClaims.Add(boardUserClaim.ToGetDto());
        }

        return userGetDtos;
    }

    public async Task<int> GetUserCount()
    {
        return await accountRepository.GetUserCount();
    }

    public async Task<UserGetDto?> GetUser(Guid guid)
    {
        User? user = await accountRepository.GetUserByGuidAsync(guid);
        return user?.ToGetDto();
    }

    public async Task<string?> RefreshJwtToken(string refreshToken)
    {
        byte[] byteToken = Convert.FromHexString(refreshToken);
        string hashedToken = tokenGeneratorService.Hash(byteToken, 32);
        
        UserSession? userSession = await sessionRepository.GetUserSessionByToken(hashedToken);
        if (userSession == null) return null;
        
        List<Claim> claims = userSession.User.UserClaims.Select(uc => new Claim(uc.Type.ToString(), uc.Value)).ToList();
        string jwt = jwtTokenGeneratorService.GenerateToken(userSession.User, claims);
        return jwt;
    }

    public async Task<bool> Logout(ClaimsPrincipal user, string userAgent)
    {
        Claim? userId = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userId == null) return false;

        Guid guid = Guid.Parse(userId.Value); 
        
        UserSession? userSession = await sessionRepository.GetUserSessionByAgent(guid, userAgent);
        if (userSession == null) return false;

        bool succeeded = await sessionRepository.InvalidateUserSession(userSession.SessionId);
        return succeeded;
    }

    public async Task<bool> LogoutEveryDevice(Guid userId)
    {
        bool succeeded = await sessionRepository.InvalidateUserSessions(userId);
        return succeeded;
    }
}