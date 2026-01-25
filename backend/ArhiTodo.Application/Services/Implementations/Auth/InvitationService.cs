using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class InvitationService(IInvitationRepository invitationRepository, ITokenGeneratorService tokenGeneratorService) : IInvitationService
{
    public async Task<InvitationLink?> GenerateInvitationLink(ClaimsPrincipal user, GenerateInvitationDto generateInvitationDto)
    {
        Claim? userId = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userId == null) return null;
        
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

        InvitationLink invitationLink = new()
        {
            InvitationLinkName = generateInvitationDto.InvitationLinkName,
            InvitationKey = Convert.ToHexString(secureInvitationLinkToken),
            CreatedDate = createdDate,
            ExpiresDate = expireDate,
            CreatedByUser = Guid.Parse(userId.Value),
            MaxUses = generateInvitationDto.MaxUses
        };
        
        InvitationLink? generatedInvitationLink = await invitationRepository.AddInvitationLinkAsync(invitationLink);
        return generatedInvitationLink;
    }

    public async Task<bool> InvalidateInvitationLink(int invitationLinkId)
    {
        bool succeeded = await invitationRepository.InvalidateInvitationLinkAsync(invitationLinkId);
        return succeeded;
    }

    public async Task<List<InvitationLink>> GetInvitationLinks()
    {
        List<InvitationLink> invitationLinks = await invitationRepository.GetInvitationLinksAsync();
        return invitationLinks;
    }
}