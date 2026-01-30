using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Mappers;

public static class ClaimMapper
{
    extension(ClaimPostDto claimPostDto)
    {
        public UserClaim FromPostDto(Guid userId)
        {
            return new UserClaim
            {
                Type = claimPostDto.ClaimType,
                Value = claimPostDto.ClaimValue,
                UserId = userId
            };
        }

        public BoardUserClaim ToBoardUserClaim(Guid userId, int boardId)
        {
            return new BoardUserClaim
            {
                BoardId = boardId,
                UserId = userId,
                Type = claimPostDto.ClaimType,
                Value = claimPostDto.ClaimValue
            };
        }
    }

    public static ClaimGetDto ToGetDto(this BoardUserClaim boardUserClaim)
    {
        return new ClaimGetDto(boardUserClaim.Type, boardUserClaim.Value);
    }

    public static ClaimGetDto ToGetDto(this UserClaim userClaim)
    {
        return new ClaimGetDto(userClaim.Type, userClaim.Value);
    }
}