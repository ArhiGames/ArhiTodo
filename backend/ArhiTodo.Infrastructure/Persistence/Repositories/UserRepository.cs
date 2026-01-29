using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class UserRepository(ProjectDataBase database) : IUserRepository
{
    public async Task<UserClaim?> GrantClaimAsync(Guid userId, UserClaim claim)
    {
        User? user = await database.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null) return null;
        
        user.UserClaims.Add(claim);
        await database.SaveChangesAsync();
        
        return claim;
    }
}