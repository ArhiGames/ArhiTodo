using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Authentication;

public class InvitationRepository(ProjectDataBase database) : IInvitationRepository
{
    public async Task<InvitationLink?> AddInvitationLinkAsync(InvitationLink invitationLink)
    {
        EntityEntry<InvitationLink> entityEntry = database.InvitationLinks.Add(invitationLink);
        await database.SaveChangesAsync();
        return entityEntry.Entity;
    }

    public async Task<InvitationLink?> GetUsableInvitationLink(string invitationLinkKey)
    {
        InvitationLink? invitationLink = await database.InvitationLinks
            .FirstOrDefaultAsync(invitationLink => invitationLink.InvitationKey == invitationLinkKey);
        return invitationLink;
    }

    public async Task<InvitationLink?> GetInvitationLinkById(int invitationLinkId)
    {
        InvitationLink? invitationLink =
            await database.InvitationLinks.FirstOrDefaultAsync(il => il.InvitationLinkId == invitationLinkId);
        return invitationLink;
    }

    public async Task<List<InvitationLink>> GetInvitationLinksAsync()
    {
        List<InvitationLink> invitationLinks = await database.InvitationLinks.ToListAsync();
        return invitationLinks;
    }
}