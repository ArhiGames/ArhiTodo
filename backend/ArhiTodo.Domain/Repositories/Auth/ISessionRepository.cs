using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories.Auth;

public interface ISessionRepository
{
    Task<UserSession?> GetUserSessionByAgent(Guid userId, string userAgent);
    Task<UserSession?> GetUserSessionByToken(string hashedToken);
    Task<bool> InvalidateUserSession(Guid userSessionId);
    Task<bool> InvalidateUserSessions(Guid userId);
}