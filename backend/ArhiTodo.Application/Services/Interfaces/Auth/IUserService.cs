using ArhiTodo.Application.DTOs.User;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface IUserService
{
    Task<ClaimGetDto?> GrantClaim(Guid userId, ClaimPostDto claimPostDto);
    Task<List<ClaimGetDto>?> UpdateClaims(Guid userId, List<ClaimPostDto> claimPostDtos);
    Task<bool> RevokeClaim(Guid userId, string claimType);
}