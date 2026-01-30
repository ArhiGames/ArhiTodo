using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories;

public interface IUserRepository
{
    Task<UserClaim?> GrantClaimAsync(Guid userId, UserClaim claim);
    Task<List<UserClaim>?> UpdateClaimsAsync(Guid userId, List<UserClaim> claims);
    Task<bool> RevokeClaimAsync(Guid userId, string claimType);
}