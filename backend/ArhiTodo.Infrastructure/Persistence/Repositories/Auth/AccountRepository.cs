using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Auth;

public class AccountRepository(IInvitationRepository invitationRepository, ProjectDataBase database) : IAccountRepository
{
    public async Task<User?> CreateUserAsync(InvitationLink invitationLink, User user)
    {
        await using IDbContextTransaction transaction = await database.Database.BeginTransactionAsync();

        try
        {
            EntityEntry<User> userEntry = database.Users.Add(user);
            await database.SaveChangesAsync();

            bool succeeded = await invitationRepository.UseInvitationLink(invitationLink.InvitationLinkId);
            if (!succeeded)
            {
                await transaction.RollbackAsync();
                return null;
            }

            await transaction.CommitAsync();

            return userEntry.Entity;
        }
        catch (Exception)
        {
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

    public async Task<List<User>> GetUsers(int page, bool includeGlobalPermissions, int? boardPermissionsBoardId)
    {
        IQueryable<User> request = database.Users;

        if (includeGlobalPermissions)
        {
            request = request.Include(u => u.UserClaims);
        }

        if (boardPermissionsBoardId != null)
        {
            request = request.Include(u => u.BoardUserClaims.Where(buc => buc.BoardId == boardPermissionsBoardId.Value));
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

    public async Task<User?> GetUserByGuidAsync(Guid guid)
    {
        User? user = await database.Users
            .Include(u => u.UserClaims)
            .FirstOrDefaultAsync(u => u.UserId == guid);
        return user;
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        User? user = await database.Users
            .Include(u => u.UserClaims)
            .FirstOrDefaultAsync(u => u.UserName == username);
        return user;
    }
}