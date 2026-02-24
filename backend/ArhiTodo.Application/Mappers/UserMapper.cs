using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Mappers;

public static class UserMapper
{
    extension(User user)
    {
        public UserGetDto ToGetDto()
        {
            return new UserGetDto
            {
                UserId = user.UserId,
                CreatedAt = user.CreatedAt,
                UserName = user.UserName,
                Email = user.Email.ToString(),
                JoinedViaInvitationKey = user.JoinedViaInvitationKey,
                UserClaims = user.GetUserClaimsAsList().Select(uc => uc.ToGetDto()).ToList()
            };
        }

        public PublicUserGetDto ToPublicGetDto()
        {
            return new PublicUserGetDto
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email.ToString()
            };
        }
    }
}