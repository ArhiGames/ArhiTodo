using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Mappers;

public static class ClaimMapper
{
    public static ClaimGetDto ToGetDto(this BoardUserClaim boardUserClaim)
    {
        return new ClaimGetDto(boardUserClaim.Type.ToString(), boardUserClaim.Value);
    }

    public static ClaimGetDto ToGetDto(this UserClaim userClaim)
    {
        return new ClaimGetDto(userClaim.Type.ToString(), userClaim.Value);
    }
}