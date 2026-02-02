using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories.Auth;

public interface IAccountRepository
{
    Task<User?> CreateUserAsync(InvitationLink invitationLink, User appUser);
    Task<bool> DeleteUserAsync(Guid userId);
    Task<bool> ChangePassword(Guid guid, string hashedPassword);
    
    Task<List<User>> GetUsers(int page, bool includeGlobalPermissions, int? boardPermissionsBoardId);
    Task<int> GetUserCount();
    Task<User?> GetUserByGuidAsync(Guid guid);
    Task<User?> GetUserByUsernameAsync(string username);
}