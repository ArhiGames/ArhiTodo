using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories.Auth;

public interface IUserRepository
{
    Task<List<User>> GetUsers(List<Guid> userIds);
    Task<User?> GetUser(Guid userId);
    Task<List<UserClaim>?> UpdateClaimsAsync(Guid userId, List<UserClaim> claims);
}