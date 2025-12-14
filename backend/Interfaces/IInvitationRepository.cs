using ArhiTodo.Models;
using ArhiTodo.Models.Accounts;

namespace ArhiTodo.Interfaces;

public interface IInvitationRepository
{
    Task<InvitationLink> GenerateInvitationLink(AppUser createdByUser);
}