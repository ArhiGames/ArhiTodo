using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories.Auth;

public interface ISessionRepository
{
    Task<UserSession?> CreateUserSession(UserSession userSession);
    Task<UserSession?> GetUserSessionByAgent(Guid userId, string userAgent);
    Task<UserSession?> GetUserSessionByToken(string hashedToken);
    Task<bool> UpdateUserSession(UserSession userSession);
    Task<bool> InvalidateUserSession(Guid userSessionId);
    Task<bool> InvalidateUserSessions(Guid userId);
}