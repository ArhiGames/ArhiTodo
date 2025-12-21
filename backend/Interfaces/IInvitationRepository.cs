using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Invitation;
using ArhiTodo.Models.Invitation;

namespace ArhiTodo.Interfaces;

public interface IInvitationRepository
{
    Task<bool> TryToUseInvitationLink(string invitationKey);
    bool IsValidInvitationLink(InvitationLink invitationLink);
    Task UsedInvitationLink(AppUser usedByUser, string invitationKey);
    Task<InvitationLink> GenerateInvitationLinkAsync(AppUser createdByUser, GenerateInvitationDto generateInvitationDto);
    Task<bool> InvalidateInvitationLinkAsync(int invitationLinkId);
    Task<List<InvitationLink>> GetAllInvitationLinksAsync();
}