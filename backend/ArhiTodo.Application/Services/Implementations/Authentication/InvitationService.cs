using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Authorization;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authentication;
using ArhiTodo.Domain.Repositories.Common;

namespace ArhiTodo.Application.Services.Implementations.Authentication;

public class InvitationService(IInvitationRepository invitationRepository, ITokenGeneratorService tokenGeneratorService,
    ICurrentUser currentUser, IUnitOfWork unitOfWork, IAuthorizationService authorizationService) : IInvitationService
{
    public async Task<Result<InvitationLinkGetDto>> GenerateInvitationLink(GenerateInvitationDto generateInvitationDto)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.InviteOtherUsers));
        if (!authorized) return Errors.Forbidden;
        
        byte[] secureInvitationLinkToken = tokenGeneratorService.GenerateSecureToken(8);
        
        DateTimeOffset createdDate = DateTimeOffset.UtcNow;
        DateTimeOffset expireDate = generateInvitationDto.ExpireType switch
        {
            ExpireType.Minutes => createdDate.AddMinutes(generateInvitationDto.ExpireNum),
            ExpireType.Hours => createdDate.AddHours(generateInvitationDto.ExpireNum),
            ExpireType.Days => createdDate.AddDays(generateInvitationDto.ExpireNum),
            ExpireType.Never => DateTimeOffset.UnixEpoch,
            _ => throw new InvalidOperationException()
        };

        string invitationKey = Convert.ToHexString(secureInvitationLinkToken);

        Result<InvitationLink> createInvitationLinkResult = InvitationLink.Create(invitationKey,
            generateInvitationDto.InvitationLinkName,
            generateInvitationDto.MaxUses,
            expireDate,
            currentUser.UserId);
        if (!createInvitationLinkResult.IsSuccess || createInvitationLinkResult.Value is null) return createInvitationLinkResult.Error!;
        foreach (ClaimPostDto defaultPermission in generateInvitationDto.DefaultClaims)
        {
            bool parsedSuccessfully = Enum.TryParse(defaultPermission.ClaimType, true, out UserClaimTypes userClaimType);
            if (!parsedSuccessfully || defaultPermission.ClaimValue != "True") continue;
            
            Result updateClaimResult = createInvitationLinkResult.Value.SetDefaultClaim(userClaimType);
            if (!updateClaimResult.IsSuccess) return updateClaimResult.Error!;
        }
        
        InvitationLink? generatedInvitationLink = await invitationRepository.AddInvitationLinkAsync(createInvitationLinkResult.Value!);
        return generatedInvitationLink is null ? Errors.Unknown : generatedInvitationLink.ToGetDto();
    }

    public async Task<Result<List<InvitationLinkGetDto>>> GetInvitationLinks()
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.InviteOtherUsers));
        if (!authorized) return Errors.Forbidden;
        
        List<InvitationLink> invitationLinks = await invitationRepository.GetInvitationLinksAsync();
        return invitationLinks.Select(il => il.ToGetDto()).ToList();
    }
    
    public async Task<Result> InvalidateInvitationLink(int invitationLinkId)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.InviteOtherUsers));
        if (!authorized) return Errors.Forbidden;
        
        InvitationLink? invitationLink = await invitationRepository.GetInvitationLinkById(invitationLinkId);
        if (invitationLink is null) return Errors.NotFound;
        
        invitationLink.Deactivate();
        await unitOfWork.SaveChangesAsync();
        
        return Result.Success();
    }
}