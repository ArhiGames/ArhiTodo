using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Repositories;

public interface IInvitationRepository
{
    Task<InvitationLink?> AddInvitationLinkAsync(InvitationLink invitationLink);
    Task<bool> InvalidateInvitationLinkAsync(int invitationLinkId);
    Task<List<InvitationLink>> GetInvitationLinksAsync();
}