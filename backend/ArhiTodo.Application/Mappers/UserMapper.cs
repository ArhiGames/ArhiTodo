using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Mappers;

public static class UserMapper
{
    public static UserGetDto ToGetDto(this User user)
    {
        return new UserGetDto
        {
            UserId = user.UserId,
            CreatedAt = user.CreatedAt,
            UserName = user.UserName,
            Email = user.Email,
            JoinedViaInvitationKey = user.JoinedViaInvitationKey,
            UserClaims = user.UserClaims.Select(uc => uc.ToGetDto()).ToList(),
            BoardUserClaims = user.BoardUserClaims.Select(buc => buc.ToGetDto()).ToList()
        };
    }
}