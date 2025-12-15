using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Invitation;
using ArhiTodo.Models.Invitation;

namespace ArhiTodo.Interfaces;

public interface IInvitationRepository
{
    Task<InvitationLink> GenerateInvitationLinkAsync(AppUser createdByUser, GenerateInvitationDto generateInvitationDto);
    Task<bool> InvalidateInvitationLinkAsync(int invitationLinkId);
    Task<List<InvitationLink>> GetAllInvitationLinksAsync();
}