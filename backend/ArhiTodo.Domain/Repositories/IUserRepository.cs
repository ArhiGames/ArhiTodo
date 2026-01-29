using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories;

public interface IUserRepository
{
    Task<User?> CreateUserAsync(InvitationLink invitationLink, User user);
    Task<bool> ChangePassword(Guid guid, string hashedPassword);
    Task<List<User>> GetUsers(int page = 0);
    Task<User?> GetUserByGuidAsync(Guid guid);
    Task<User?> GetUserByUsernameAsync(string username);

    Task<UserSession?> CreateUserSession(UserSession userSession);
    Task<UserSession?> GetUserSessionByAgent(Guid userId, string userAgent);
    Task<UserSession?> GetUserSessionByToken(string hashedToken);
    Task<bool> UpdateUserSession(UserSession userSession);
    Task<bool> InvalidateUserSession(Guid userSessionId);
    Task<bool> InvalidateUserSessions(Guid userId);
}