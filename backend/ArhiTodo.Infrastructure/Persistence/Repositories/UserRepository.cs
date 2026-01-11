using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class UserRepository(ProjectDataBase database) : IUserRepository
{
    public async Task<User?> CreateUserAsync(User user)
    {
        EntityEntry<User> userEntry = database.Users.Add(user);
        await database.SaveChangesAsync();
        return userEntry.Entity;
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        User? user = await database.Users.FirstOrDefaultAsync(u => u.UserName == username);
        return user;
    }

    public async Task<UserSession?> GetUserSessionByAgent(User user, string userAgent)
    {
        UserSession? userSession = await database.UserSessions
            .FirstOrDefaultAsync(us => us.UserId == user.UserId && us.UserAgent == userAgent);
        return userSession;
    }

    public async Task<UserSession?> CreateUserSession(UserSession userSession)
    {
        EntityEntry<UserSession> userSessionEntry = database.UserSessions.Add(userSession);
        await database.SaveChangesAsync();
        return userSessionEntry.Entity;
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
}