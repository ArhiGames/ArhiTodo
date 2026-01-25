using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

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
            .FirstOrDefaultAsync(invitationLink => invitationLink.InvitationKey == invitationLinkKey && 
               (invitationLink.IsActive) &&
               (invitationLink.MaxUses == 0 || invitationLink.Uses < invitationLink.MaxUses) &&
               (invitationLink.ExpiresDate == DateTimeOffset.UnixEpoch || DateTimeOffset.UtcNow < invitationLink.ExpiresDate));
        return invitationLink;
    }

    public async Task<bool> UseInvitationLink(int invitationLinkId)
    {
        InvitationLink? invitationLink = await database.InvitationLinks
            .FirstOrDefaultAsync(il => il.InvitationLinkId == invitationLinkId);
        if (invitationLink == null) return false;
        
        invitationLink.Uses++;
        await database.SaveChangesAsync();
        return true;
    }

    public async Task<bool> InvalidateInvitationLinkAsync(int invitationLinkId)
    {
        int changedRows = await database.InvitationLinks
            .Where(il => il.InvitationLinkId == invitationLinkId)
            .ExecuteUpdateAsync(p => p.SetProperty(il => il.IsActive, false));
        return changedRows == 1;
    }

    public async Task<List<InvitationLink>> GetInvitationLinksAsync()
    {
        List<InvitationLink> invitationLinks = await database.InvitationLinks
            .Where(invitationLink => invitationLink.IsActive && 
                                     (invitationLink.MaxUses == 0 || invitationLink.Uses < invitationLink.MaxUses) && 
                                     (invitationLink.ExpiresDate == DateTimeOffset.UnixEpoch || DateTimeOffset.UtcNow < invitationLink.ExpiresDate))
            .ToListAsync();
        
        return invitationLinks;
    }
    
    /*public async Task<bool> TryToUseInvitationLink(string invitationKey)
    {
        InvitationLink? invitationLink = await _dataBase.InvitationLinks.FirstOrDefaultAsync(link => link.InvitationKey == invitationKey);
        if (invitationLink == null)
        {
            return false;
        }
        return IsValidInvitationLink(invitationLink);
    }

    public bool IsValidInvitationLink(InvitationLink invitationLink)
    {
        bool bIsActive = invitationLink.IsActive;
        bool bExpired = invitationLink.CreatedDate != invitationLink.ExpiresDate && DateTime.UtcNow > invitationLink.ExpiresDate;
        bool bOverused = invitationLink.MaxUses != 0 && invitationLink.Uses >= invitationLink.MaxUses;
        return bIsActive && !bExpired && !bOverused;
    }

    public async Task UsedInvitationLink(AppUser usedByUser, string invitationKey)
    {
        InvitationLink? invitationLink = await _dataBase.InvitationLinks.FirstOrDefaultAsync(link => link.InvitationKey == invitationKey);
        if (invitationLink == null)
        {
            return;
        }

        invitationLink.Uses++;
        usedByUser.InvitationLinkId = invitationLink.InvitationLinkId;
        await _dataBase.SaveChangesAsync();
    }

    public async Task<List<InvitationLink>> GetAllInvitationLinksAsync()
    {
        List<InvitationLink> invitationLinks = await _dataBase.InvitationLinks
            .Where(invitationLink => invitationLink.IsActive && 
                                     (invitationLink.MaxUses == 0 || invitationLink.Uses < invitationLink.MaxUses))
            .ToListAsync();
        
        return invitationLinks.Where(invitationLink => 
            invitationLink.CreatedDate == invitationLink.ExpiresDate || DateTimeOffset.UtcNow < invitationLink.ExpiresDate).ToList();
    }*/
}