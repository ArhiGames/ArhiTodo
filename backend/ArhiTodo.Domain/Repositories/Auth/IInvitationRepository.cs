using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories.Auth;

public interface IInvitationRepository
{
    Task<InvitationLink?> AddInvitationLinkAsync(InvitationLink invitationLink);
    Task<InvitationLink?> GetUsableInvitationLink(string invitationLinkKey);
    Task<InvitationLink?> GetInvitationLinkById(int invitationLinkId);
    Task<List<InvitationLink>> GetInvitationLinksAsync();
}