using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories;

public interface IUserRepository
{
    Task<User?> CreateUserAsync(User user);
    Task<User?> GetUserByUsernameAsync(string username);

    Task<UserSession?> CreateUserSession(UserSession userSession);
    Task<UserSession?> GetUserSessionByAgent(Guid userId, string userAgent);
    Task<UserSession?> GetUserSessionByToken(string hashedToken);
    Task<bool> UpdateUserSession(UserSession userSession);
    Task<bool> InvalidateUserSession(Guid userSessionId);
    Task<bool> InvalidateUserSessions(Guid userId);
}