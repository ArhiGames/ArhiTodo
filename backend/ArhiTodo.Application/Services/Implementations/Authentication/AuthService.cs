using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Authorization;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authentication;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Services.Auth;
using ArhiTodo.Domain.ValueObjects;

namespace ArhiTodo.Application.Services.Implementations.Authentication;

public class AuthService(
    IAccountRepository accountRepository, ITokenService tokenService, IJwtTokenGeneratorService jwtTokenGeneratorService, 
    IPasswordHashService passwordHashService, ITokenGeneratorService tokenGeneratorService, IInvitationRepository invitationRepository, 
    IPasswordAuthorizer passwordAuthorizer, ICurrentUser currentUser, IAuthorizationService authorizationService, IUnitOfWork unitOfWork) : IAuthService
{
    public async Task<Result> CreateAccount(CreateAccountDto createAccountDto)
    {
        Result<Email> email = Email.Create(createAccountDto.Email);
        if (!email.IsSuccess) return email;
        
        Result passwordAuthorizerResult =
            passwordAuthorizer.VerifyPasswordSecurity(createAccountDto.Password);
        if (!passwordAuthorizerResult.IsSuccess) return passwordAuthorizerResult;

        InvitationLink? invitationLink =
            await invitationRepository.GetUsableInvitationLink(createAccountDto.InvitationKey);
        if (invitationLink is null) return Errors.InvalidInvitationLink;
        
        string hashedPassword = passwordHashService.Hash(createAccountDto.Password);

        Result<User> createUserResult = User.Create(createAccountDto.Username, email.Value!, 
            hashedPassword, invitationLink.InvitationKey);
        if (!createUserResult.IsSuccess) return createUserResult;
        
        User? createdUser = await accountRepository.CreateUserAsync(invitationLink, createUserResult.Value!);

        return createdUser is null ? Errors.Unknown : Result.Success();
    }
    
    public async Task<Result<LoginGetDto>> Login(LoginDto loginDto, string userAgent)
    {
        User? user = await accountRepository.GetUserByUsernameAsync(loginDto.Username, true);
        if (user is null) return Errors.NotFound;

        bool passwordCorrect = passwordHashService.Verify(loginDto.Password, user.HashedPassword);
        if (!passwordCorrect) return Errors.Unauthenticated;

        string refreshToken = await tokenService.GenerateRefreshTokenAndAddSessionEntry(user, userAgent);
        
        List<Claim> claims = user.UserClaims.Select(uc => new Claim(uc.Type.ToString(), uc.Value.ToString())).ToList();
        string jwt = jwtTokenGeneratorService.GenerateToken(user, claims);
        
        return new LoginGetDto(user.UserId, jwt, refreshToken);
    }

    public async Task<Result> ChangePassword(UpdatePasswordDto updatePasswordDto)
    {
        Result passwordAuthorizerResult =
            passwordAuthorizer.VerifyPasswordSecurity(updatePasswordDto.NewPassword);
        if (!passwordAuthorizerResult.IsSuccess) return passwordAuthorizerResult;

        User? foundUser = await accountRepository.GetUserByGuidAsync(currentUser.UserId);
        if (foundUser is null) return Errors.Unauthenticated;

        bool isCorrectPassword = passwordHashService.Verify(updatePasswordDto.OldPassword, foundUser.HashedPassword);
        if (!isCorrectPassword) return Errors.Unauthenticated;

        string hashedPassword = passwordHashService.Hash(updatePasswordDto.NewPassword);
        bool succeeded = await accountRepository.ChangePassword(currentUser.UserId, hashedPassword);

        await LogoutEveryDevice(currentUser.UserId);
        
        return succeeded ? Result.Success() : Errors.Unknown;
    }

    public async Task<Result> DeleteAccount(Guid userId)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.DeleteUsers));
        if (!authorized) return Errors.Forbidden;
        
        bool succeeded = await accountRepository.DeleteUserAsync(userId);
        return succeeded ? Result.Success() : Errors.Unknown;
    }

    public async Task<Result<string>> RefreshJwtToken(string refreshToken)
    {
        User? user = await accountRepository.GetUserByGuidAsync(currentUser.UserId, true);
        if (user is null) return Errors.Unauthenticated; 
        
        byte[] byteToken = Convert.FromHexString(refreshToken);
        string hashedToken = tokenGeneratorService.Hash(byteToken, 32);
        
        UserSession? userSession = user.UserSessions.FirstOrDefault(us => us.TokenHash == hashedToken);
        if (userSession == null) return Errors.Unauthenticated;
        
        List<Claim> claims = userSession.User.UserClaims.Select(uc => new Claim(uc.Type.ToString(), uc.Value.ToString())).ToList();
        string jwt = jwtTokenGeneratorService.GenerateToken(userSession.User, claims);
        return jwt;
    }

    public async Task<Result> Logout(string userAgent)
    {
        User? user = await accountRepository.GetUserByGuidAsync(currentUser.UserId, true);
        if (user is null) return Errors.Unauthenticated;

        Result removeUserSessionResult = user.RemoveUserSession(userAgent);
        await unitOfWork.SaveChangesAsync();
        
        return removeUserSessionResult.IsSuccess ? Result.Success() : Errors.Unknown;
    }

    public async Task<Result> LogoutEveryDevice(Guid userId)
    {
        User? user = await accountRepository.GetUserByGuidAsync(userId, true);
        if (user is null) return Errors.Unauthenticated;
        
        user.ClearUserSessions();
        await unitOfWork.SaveChangesAsync();

        return Result.Success();
    }
}