using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using ArhiTodo.Domain.Repositories.Common;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class InvitationService(IInvitationRepository invitationRepository, ITokenGeneratorService tokenGeneratorService,
    ICurrentUser currentUser, IUnitOfWork unitOfWork) : IInvitationService
{
    public async Task<InvitationLink?> GenerateInvitationLink(GenerateInvitationDto generateInvitationDto)
    {
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
        return generatedInvitationLink;
    }
    
    public async Task<bool> InvalidateInvitationLink(int invitationLinkId)
    {
        InvitationLink? invitationLink = await invitationRepository.GetInvitationLinkById(invitationLinkId);
        if (invitationLink == null) return false;
        
        invitationLink.Deactivate();
        await unitOfWork.SaveChangesAsync();
        
        return true;
    }

    public async Task<InvitationLink?> GetUsableInvitationLink(string invitationLinkKey)
    {
        InvitationLink? invitationLink = await invitationRepository.GetUsableInvitationLink(invitationLinkKey);
        return invitationLink;
    }

    public async Task<List<InvitationLink>> GetInvitationLinks()
    {
        List<InvitationLink> invitationLinks = await invitationRepository.GetInvitationLinksAsync();
        return invitationLinks;
    }
}