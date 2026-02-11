using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories.Auth;

public interface IAccountRepository
{
    Task<User?> CreateUserAsync(InvitationLink invitationLink, User appUser);
    Task<bool> DeleteUserAsync(Guid userId);
    Task<bool> ChangePassword(Guid guid, string hashedPassword);
    
    Task<List<User>> GetUsers(int page, bool includeGlobalPermissions);
    Task<int> GetUserCount();
    Task<List<User>> GetUsersByGuidsAsync(List<Guid> guids);
    Task<User?> GetUserByGuidAsync(Guid guid, bool includeSessions = false);
    Task<User?> GetUserByUsernameAsync(string username, bool includeSessions = false);
}