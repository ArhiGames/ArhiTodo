using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Auth;

public class AccountRepository(ProjectDataBase database) : IAccountRepository
{
    public async Task<User?> CreateUserAsync(InvitationLink invitationLink, User user)
    {
        await using IDbContextTransaction transaction = await database.Database.BeginTransactionAsync();

        try
        {
            EntityEntry<User> userEntry = database.Users.Add(user);
            await database.SaveChangesAsync();

            Result invitationResult = invitationLink.Use();
            if (!invitationResult.IsSuccess)
            {
                await transaction.RollbackAsync();
                return null;    
            }
            await database.SaveChangesAsync();

            await transaction.CommitAsync();

            return userEntry.Entity;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            return null;
        }
    }

    public async Task<bool> DeleteUserAsync(Guid userId)
    {
        int changedRows = await database.Users
            .Where(u => u.UserId == userId)
            .ExecuteDeleteAsync();
        return changedRows == 1;
    }

    public async Task<bool> ChangePassword(Guid guid, string hashedPassword)
    {
        int changedRows = await database.Users
            .Where(u => u.UserId == guid)
            .ExecuteUpdateAsync(p => p.SetProperty(u => u.HashedPassword, hashedPassword));
        return changedRows >= 1;
    }

    public async Task<List<User>> GetUsers(int page, bool includeGlobalPermissions)
    {
        IQueryable<User> request = database.Users;

        if (includeGlobalPermissions)
        {
            request = request.Include(u => u.UserClaims);
        }

        List<User> users = await request
            .OrderBy(u => u.CreatedAt)
            .Skip(5 * page)
            .Take(5)
            .ToListAsync();
        return users;
    }

    public async Task<int> GetUserCount()
    {
        return await database.Users.CountAsync();
    }

    public async Task<List<User>> GetUsersByGuidsAsync(List<Guid> guids)
    {
        List<User> users = await database.Users
            .Where(u => guids.Contains(u.UserId))
            .ToListAsync();
        return users;
    }

    public async Task<User?> GetUserByGuidAsync(Guid guid, bool includeSessions = false)
    {
        IQueryable<User> userQuery = database.Users.Include(u => u.UserClaims);
        if (includeSessions)
        {
            userQuery = userQuery.Include(u => u.UserSessions);
        }
        return await userQuery.FirstOrDefaultAsync(u => u.UserId == guid);
    }

    public async Task<User?> GetUserByUsernameAsync(string username, bool includeSessions = false)
    {
        IQueryable<User> userQuery = database.Users.Include(u => u.UserClaims);
        if (includeSessions)
        {
            userQuery = userQuery.Include(u => u.UserSessions);
        }
        return await userQuery.FirstOrDefaultAsync(u => u.UserName == username);
    }
}