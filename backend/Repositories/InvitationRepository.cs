using System.Text;
using ArhiTodo.Data;
using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.Accounts;

namespace ArhiTodo.Repositories;

public class InvitationRepository : IInvitationRepository
{
    private readonly ProjectDataBase _dataBase;
    
    public InvitationRepository(ProjectDataBase dataBase)
    {
        _dataBase = dataBase;
    }
    
    public async Task<InvitationLink> GenerateInvitationLink(AppUser createdByUser)
    {
        Random random = new();
        StringBuilder stringBuilder = new();
        for (int i = 0; i < 16; i++)
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

        InvitationLink invitationLink = new()
        {
            InvitationKey = stringBuilder.ToString(),
            ExpiresDate = DateTime.UtcNow.AddDays(7),
            CreatedByUser = createdByUser.Id
        };
        
        await _dataBase.InvitationLinks.AddAsync(invitationLink);
        await _dataBase.SaveChangesAsync();
        return invitationLink;
    }
}