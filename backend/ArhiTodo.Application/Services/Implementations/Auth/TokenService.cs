using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class TokenService(IUserRepository userRepository, ITokenGeneratorService tokenGeneratorService) : ITokenService
{
    public async Task<string?> GenerateRefreshTokenAndAddSessionEntry(User user, string userAgent)
    {
        string refreshToken = tokenGeneratorService.GenerateSecureHash(32);
        
        UserSession? existingSession = await userRepository.GetUserSessionByAgent(user.UserId, userAgent);
        
        if (existingSession == null)
        {
            UserSession userSession = new()
            {
                UserId = user.UserId,
                ExpiresAt = DateTimeOffset.UtcNow.AddDays(7),
                TokenHash = refreshToken,
                UserAgent = userAgent
            };
            
            UserSession? createdUserSession = await userRepository.CreateUserSession(userSession);
            if (createdUserSession == null) return null;
        }
        else
        {
            existingSession.ExpiresAt = DateTimeOffset.UtcNow.AddDays(7);
            existingSession.TokenHash = refreshToken;
            
            bool succeeded = await userRepository.UpdateUserSession(existingSession);
            if (!succeeded) return null;
        }
        
        return refreshToken;
    }
}