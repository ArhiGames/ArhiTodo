using System.Security.Claims;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class UserRepository(ProjectDataBase database) : IUserRepository
{
    public async Task<User?> CreateUserAsync(User user)
    {
        EntityEntry<User> userEntry = database.Users.Add(user);
        await database.SaveChangesAsync();
        return userEntry.Entity;
    }
}