using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Mappers;

public static class ClaimMapper
{
    public static UserClaim FromPostDto(this ClaimPostDto claimPostDto, Guid userId)
    {
        return new UserClaim
        {
            Type = claimPostDto.ClaimType,
            Value = claimPostDto.ClaimValue,
            UserId = userId
        };
    }

    public static ClaimGetDto ToGetDto(this UserClaim userClaim)
    {
        return new ClaimGetDto(userClaim.Type, userClaim.Value);
    }
}