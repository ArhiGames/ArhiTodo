using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories;

public interface IUserRepository
{
    Task<User?> CreateUserAsync(User user);
    Task<User?> GetUserByUsernameAsync(string username);

    Task<UserSession?> GetUserSessionByAgent(User user, string userAgent);
    Task<UserSession?> CreateUserSession(UserSession userSession);
    Task<bool> UpdateUserSession(UserSession userSession);
    Task<bool> InvalidateUserSession(Guid userSessionId);
}