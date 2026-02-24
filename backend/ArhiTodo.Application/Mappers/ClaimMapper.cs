using System.Security.Claims;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Mappers;

public static class ClaimMapper
{
    public static ClaimGetDto ToGetDto(this Claim claim)
    {
        return new ClaimGetDto(claim.Type, claim.Value);
    }
    
    public static ClaimGetDto ToGetDto(this BoardUserClaim boardUserClaim)
    {
        return new ClaimGetDto(boardUserClaim.Type.ToString(), boardUserClaim.Value.ToString());
    }
}