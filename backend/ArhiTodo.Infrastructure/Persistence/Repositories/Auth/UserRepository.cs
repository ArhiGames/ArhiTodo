using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Auth;

public class UserRepository(ProjectDataBase database) : IUserRepository
{
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
}