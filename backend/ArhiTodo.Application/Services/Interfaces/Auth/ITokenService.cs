using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface ITokenService
{
    /// <param name="user">The user reference to add the token to</param>
    /// <param name="userAgent">User Agent Data, provided in each browser request header</param>
    /// <returns>Returns the unhashed token that was generated and saved to the database</returns>
    Task<string?> GenerateRefreshTokenAndAddSessionEntry(User user, string userAgent);
}