using System.Security.Claims;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Services.Auth;

public interface IJwtTokenGeneratorService
{
    string GenerateToken(User user, IList<Claim> claims);
}