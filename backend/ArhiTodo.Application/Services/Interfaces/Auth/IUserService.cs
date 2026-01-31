using ArhiTodo.Application.DTOs.User;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface IUserService
{
    Task<List<ClaimGetDto>?> UpdateClaims(Guid userId, List<ClaimPostDto> claimPostDtos);
}