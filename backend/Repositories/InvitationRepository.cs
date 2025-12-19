using System.Text;
using ArhiTodo.Data;
using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Invitation;
using ArhiTodo.Models.Invitation;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Repositories;

public class InvitationRepository : IInvitationRepository
{
    private readonly ProjectDataBase _dataBase;
    
    public InvitationRepository(ProjectDataBase dataBase)
    {
        _dataBase = dataBase;
    }

    public async Task<bool> TryToUseInvitationLink(string invitationKey)
    {
        InvitationLink? invitationLink = await _dataBase.InvitationLinks.FirstOrDefaultAsync(link => link.InvitationKey == invitationKey);
        if (invitationLink == null)
        {
            return false;
        }

        bool bIsActive = invitationLink.IsActive;
        bool bExpired = DateTime.UtcNow > invitationLink.ExpiresDate;
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
    
    public async Task<InvitationLink> GenerateInvitationLinkAsync(AppUser createdByUser, GenerateInvitationDto generateInvitationDto)
    {
        Random random = new();
        StringBuilder stringBuilder = new();
        for (int i = 0; i < 32; i++)
        {
            bool capitalLetter = random.Next(2) == 0;
            if (capitalLetter)
            {
                int letter = random.Next(26);
                stringBuilder.Append((char)(letter + 65));
            }
            else
            {
                int letter = random.Next(26);
                stringBuilder.Append((char)(letter + 97));
            }
        }

        DateTime createdDate = DateTime.UtcNow;
        DateTime expireDate = generateInvitationDto.ExpireType switch
        {
            ExpireType.Minutes => createdDate.AddMinutes(generateInvitationDto.ExpireNum),
            ExpireType.Hours => createdDate.AddHours(generateInvitationDto.ExpireNum),
            ExpireType.Days => createdDate.AddDays(generateInvitationDto.ExpireNum),
            ExpireType.Never => createdDate,
            _ => throw new InvalidOperationException()
        };

        InvitationLink invitationLink = new()
        {
            InvitationKey = stringBuilder.ToString(),
            CreatedDate = createdDate,
            ExpiresDate = expireDate,
            CreatedByUser = createdByUser.Id,
            MaxUses = generateInvitationDto.MaxUses
        };
        
        await _dataBase.InvitationLinks.AddAsync(invitationLink);
        await _dataBase.SaveChangesAsync();
        return invitationLink;
    }

    public async Task<bool> InvalidateInvitationLinkAsync(int invitationLinkId)
    {
        InvitationLink? invitationLink = await _dataBase.InvitationLinks.FirstOrDefaultAsync(link => link.InvitationLinkId == invitationLinkId);
        if (invitationLink == null)
        {
            throw new InvalidOperationException("Not found");
        }

        invitationLink.IsActive = false;
        await _dataBase.SaveChangesAsync();
        return true;
    }

    public async Task<List<InvitationLink>> GetAllInvitationLinksAsync()
    {
        return await _dataBase.InvitationLinks.ToListAsync();
    }
}