using System.Security.Claims;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using Microsoft.AspNetCore.Http;

namespace ArhiTodo.Infrastructure.Identity;

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    public bool IsAuthenticated => httpContextAccessor.HttpContext?.
        User?.
        Identity?.
        IsAuthenticated ?? throw new ApplicationException("UserContext unavailable!");

    public Guid UserId => Guid.Parse(
        httpContextAccessor.
            HttpContext?
            .User
            .FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new ApplicationException("UserContext unavailabel"));
}