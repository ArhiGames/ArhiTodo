using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Mappers;

public static class InvitationLinkMapper
{
    public static InvitationLinkGetDto ToGetDto(this InvitationLink invitationLink)
    {
        return new InvitationLinkGetDto
        {
            InvitationLinkId = invitationLink.InvitationLinkId,
            InvitationKey = invitationLink.InvitationKey,
            InvitationLinkName = invitationLink.InvitationLinkName,
            CreatedDate = invitationLink.CreatedDate,
            ExpiresDate = invitationLink.ExpiresDate,
            DefaultInvitationClaims = invitationLink.DefaultInvitationClaims,
            MaxUses = invitationLink.MaxUses,
            Uses = invitationLink.Uses,
            IsActive = invitationLink.IsActive,
            CreatedByUser = invitationLink.CreatedByUser.ToPublicGetDto()
        };
    }
}