using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Authorization;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using ArhiTodo.Domain.Repositories.Common;

namespace ArhiTodo.Application.Services.Implementations.Authentication;

public class InvitationService(IInvitationRepository invitationRepository, ITokenGeneratorService tokenGeneratorService,
    ICurrentUser currentUser, IUnitOfWork unitOfWork, IAuthorizationService authorizationService) : IInvitationService
{
    public async Task<Result<InvitationLink>> GenerateInvitationLink(GenerateInvitationDto generateInvitationDto)
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

        InvitationLink invitationLink = new(invitationKey,
            generateInvitationDto.InvitationLinkName,
            generateInvitationDto.MaxUses,
            expireDate,
            currentUser.UserId);
        
        InvitationLink? generatedInvitationLink = await invitationRepository.AddInvitationLinkAsync(invitationLink);
        return generatedInvitationLink is null ? Errors.Unknown : generatedInvitationLink;
    }

    public async Task<Result<List<InvitationLink>>> GetInvitationLinks()
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.InviteOtherUsers));
        if (!authorized) return Errors.Forbidden;
        
        List<InvitationLink> invitationLinks = await invitationRepository.GetInvitationLinksAsync();
        return invitationLinks;
    }
    
    public async Task<Result> InvalidateInvitationLink(int invitationLinkId)
    {
        bool authorized = await authorizationService.CheckPolicy(nameof(UserClaimTypes.InviteOtherUsers));
        if (!authorized) return Errors.Forbidden;
        
        InvitationLink? invitationLink = await invitationRepository.GetInvitationLinkById(invitationLinkId);
        if (invitationLink == null) return Errors.NotFound;
        
        invitationLink.Deactivate();
        await unitOfWork.SaveChangesAsync();
        
        return Result.Success();
    }
}