using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<List<ClaimGetDto>?> UpdateClaims(Guid userId, List<ClaimPostDto> claimPostDtos)
    {
        List<UserClaim> claims = claimPostDtos.Select(c => c.FromPostDto(userId)).ToList();
        List<UserClaim>? userClaims = await userRepository.UpdateClaimsAsync(userId, claims);
        if (userClaims == null) return null;

        List<ClaimGetDto> claimGetDtos = userClaims.Select(uc => uc.ToGetDto()).ToList();
        return claimGetDtos;
    }
}