using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Common;

namespace ArhiTodo.Application.Services.Implementations.Authentication;

public class TokenService(IUnitOfWork unitOfWork, ITokenGeneratorService tokenGeneratorService) : ITokenService
{
    public async Task<string> GenerateRefreshTokenAndAddSessionEntry(User user, string userAgent)
    {
        byte[] refreshToken = tokenGeneratorService.GenerateSecureToken(32);
        string hashedToken = tokenGeneratorService.Hash(refreshToken, 32);

        UserSession? existingSession =
            user.UserSessions.FirstOrDefault(us => us.UserId == user.UserId && us.UserAgent == userAgent);
        
        if (existingSession is null)
        {
            UserSession userSession = new(user.UserId, hashedToken, userAgent, DateTimeOffset.UtcNow.AddDays(14));
            user.AddUserSession(userSession);
        }
        else
        {
            existingSession.UpdateUserSession(DateTimeOffset.UtcNow.AddDays(14), hashedToken);
        }
        await unitOfWork.SaveChangesAsync();

        return Convert.ToHexString(refreshToken);
    }
}