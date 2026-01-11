using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface ITokenService
{
    Task<string?> GenerateRefreshTokenAndAddSessionEntry(User user, string userAgent);
}