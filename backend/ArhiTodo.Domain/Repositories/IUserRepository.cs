using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories;

public interface IUserRepository
{
    Task<UserClaim?> GrantClaimAsync(Guid userId, UserClaim claim);
}