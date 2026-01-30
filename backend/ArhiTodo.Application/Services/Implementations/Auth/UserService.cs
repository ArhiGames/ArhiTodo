using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<ClaimGetDto?> GrantClaim(Guid userId, ClaimPostDto claimPostDto)
    {
        UserClaim? userClaim = await userRepository.GrantClaimAsync(userId, claimPostDto.FromPostDto(userId));
        return userClaim?.ToGetDto();
    }

    public async Task<List<ClaimGetDto>?> UpdateClaims(Guid userId, List<ClaimPostDto> claimPostDtos)
    {
        List<UserClaim> claims = claimPostDtos.Select(c => c.FromPostDto(userId)).ToList();
        List<UserClaim>? userClaims = await userRepository.UpdateClaimsAsync(userId, claims);
        if (userClaims == null) return null;

        List<ClaimGetDto> claimGetDtos = userClaims.Select(uc => uc.ToGetDto()).ToList();
        return claimGetDtos;
    }

    public async Task<bool> RevokeClaim(Guid userId, string claimType)
    {
        bool succeeded = await userRepository.RevokeClaimAsync(userId, claimType);
        return succeeded;
    }
}