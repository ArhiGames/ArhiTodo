using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories.Auth;

public interface IUserRepository
{
    Task<List<UserClaim>?> UpdateClaimsAsync(Guid userId, List<UserClaim> claims);
}