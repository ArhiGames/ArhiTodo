using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Auth;

public class SessionRepository(ProjectDataBase database) : ISessionRepository
{
    public async Task<UserSession?> CreateUserSession(UserSession userSession)
    {
        EntityEntry<UserSession> userSessionEntry = database.UserSessions.Add(userSession);
        await database.SaveChangesAsync();
        return userSessionEntry.Entity;
    }

    public async Task<UserSession?> GetUserSessionByAgent(Guid userId, string userAgent)
    {
        UserSession? userSession = await database.UserSessions
            .Include(us => us.User)
                .ThenInclude(u => u.UserClaims)
            .FirstOrDefaultAsync(us => us.UserId == userId && 
                                       us.UserAgent == userAgent && 
                                       us.ExpiresAt > DateTime.UtcNow);
        return userSession;
    }

    public async Task<UserSession?> GetUserSessionByToken(string hashedToken)
    {
        UserSession? userSession = await database.UserSessions
            .Include(us => us.User)
                .ThenInclude(u => u.UserClaims)
            .FirstOrDefaultAsync(us => us.TokenHash == hashedToken &&
                                       us.ExpiresAt > DateTime.UtcNow);
        return userSession;
    }

    public async Task<bool> UpdateUserSession(UserSession userSession)
    {
        int changedRows = await database.UserSessions
            .Where(us => us.SessionId == userSession.SessionId)
            .ExecuteUpdateAsync(p => p
                .SetProperty(us => us.TokenHash, userSession.TokenHash)
                .SetProperty(us => us.ExpiresAt, userSession.ExpiresAt));
        return changedRows >= 1;
    }

    public async Task<bool> InvalidateUserSession(Guid userSessionId)
    {
        int changedRows = await database.UserSessions
            .Where(us => us.SessionId == userSessionId)
            .ExecuteDeleteAsync();
        return changedRows >= 1;
    }

    public async Task<bool> InvalidateUserSessions(Guid userId)
    {
        int changedRows = await database.UserSessions
            .Where(us => us.UserId == userId)
            .ExecuteDeleteAsync();
        return changedRows >= 1;
    }
}