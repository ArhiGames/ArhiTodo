using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories;

public interface IInvitationRepository
{
    Task<InvitationLink?> AddInvitationLinkAsync(InvitationLink invitationLink);
    Task<InvitationLink?> GetUsableInvitationLink(string invitationLinkKey);
    Task<bool> UseInvitationLink(int invitationLinkId);
    Task<bool> InvalidateInvitationLinkAsync(int invitationLinkId);
    Task<List<InvitationLink>> GetInvitationLinksAsync();
}