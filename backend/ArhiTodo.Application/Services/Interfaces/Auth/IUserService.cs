using ArhiTodo.Application.DTOs.User;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface IUserService
{
    Task<ClaimGetDto?> GrantClaim(Guid userId, ClaimPostDto claimPostDto);
    Task<bool> RevokeClaim(Guid userId, string claimType);
}