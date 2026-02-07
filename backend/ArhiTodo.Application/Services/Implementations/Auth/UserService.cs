using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using ArhiTodo.Domain.Repositories.Common;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class UserService(IUnitOfWork unitOfWork, IAccountRepository accountRepository) : IUserService
{
    public async Task<List<ClaimGetDto>?> UpdateClaims(Guid userId, List<ClaimPostDto> claimPostDtos)
    {
        User? user = await accountRepository.GetUserByGuidAsync(userId);
        if (user is null) return null;

        foreach (ClaimPostDto claimPostDto in claimPostDtos)
        {
            bool succeededParsing = Enum.TryParse(claimPostDto.ClaimType, out UserClaimTypes userClaimType);
            if (!succeededParsing) continue;
            
            UserClaim? existingClaim = user.UserClaims.FirstOrDefault(uc => uc.Type == userClaimType);
            if (existingClaim is null)
            {
                user.AddUserClaim(userClaimType, claimPostDto.ClaimValue);
            }
            else
            {
                existingClaim.ChangeClaimValue(claimPostDto.ClaimValue);
            }
        }

        await unitOfWork.SaveChangesAsync();
        return user.UserClaims.Select(uc => uc.ToGetDto()).ToList();
    }
}