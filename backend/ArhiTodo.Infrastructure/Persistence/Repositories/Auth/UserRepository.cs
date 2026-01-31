using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Auth;

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

    public async Task<List<UserClaim>?> UpdateClaimsAsync(Guid userId, List<UserClaim> claims)
    {
        User? user = await database.Users
            .Include(u => u.UserClaims)
            .FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null) return null;

        foreach (UserClaim userClaim in claims)
        {
            UserClaim? existingClaim = user.UserClaims.Find(c => c.Type == userClaim.Type);
            if (existingClaim == null)
            {
                user.UserClaims.Add(userClaim);
            }
            else
            {
                existingClaim.Value = userClaim.Value;
            }
        }

        await database.SaveChangesAsync();

        return user.UserClaims;
    }

    public async Task<bool> RevokeClaimAsync(Guid userId, string claimType)
    {
        User? user = await database.Users
            .Include(u => u.UserClaims)
            .FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null) return false;

        UserClaim? userClaim = user.UserClaims.Find(uc => uc.Type == claimType);
        if (userClaim == null) return false; 
        bool removed = user.UserClaims.Remove(userClaim);

        await database.SaveChangesAsync();
        return removed;
    }
}