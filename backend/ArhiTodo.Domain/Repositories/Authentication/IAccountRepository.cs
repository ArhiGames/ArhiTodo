using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories.Authentication;

public interface IAccountRepository
{
    Task<User?> CreateUserAsync(InvitationLink invitationLink, User appUser);
    Task<bool> DeleteUserAsync(Guid userId);
    
    Task<List<User>> GetUsers(int page);
    Task<int> GetUserCount();
    Task<List<User>> GetUsersByGuidsAsync(List<Guid> guids);
    Task<User?> GetUserByGuidAsync(Guid guid, bool includeSessions = false);
    Task<User?> GetUserByUsernameAsync(string username, bool includeSessions = false);
}