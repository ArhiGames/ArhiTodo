using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class TokenService(IAccountRepository accountRepository, ITokenGeneratorService tokenGeneratorService) : ITokenService
{
    public async Task<string?> GenerateRefreshTokenAndAddSessionEntry(User user, string userAgent)
    {
        byte[] refreshToken = tokenGeneratorService.GenerateSecureToken(32);
        string hashedToken = tokenGeneratorService.Hash(refreshToken, 32);
        
        UserSession? existingSession = await accountRepository.GetUserSessionByAgent(user.UserId, userAgent);
        
        if (existingSession == null)
        {
            UserSession userSession = new()
            {
                UserId = user.UserId,
                ExpiresAt = DateTimeOffset.UtcNow.AddDays(14),
                TokenHash = hashedToken,
                UserAgent = userAgent
            };
            
            UserSession? createdUserSession = await accountRepository.CreateUserSession(userSession);
            if (createdUserSession == null) return null;
        }
        else
        {
            existingSession.ExpiresAt = DateTimeOffset.UtcNow.AddDays(14);
            existingSession.TokenHash = hashedToken;
            
            bool succeeded = await accountRepository.UpdateUserSession(existingSession);
            if (!succeeded) return null;
        }
        
        return Convert.ToHexString(refreshToken);
    }
}