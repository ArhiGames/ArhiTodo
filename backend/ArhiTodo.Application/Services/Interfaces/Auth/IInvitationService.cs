using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface IInvitationService
{
    Task<InvitationLink?> GenerateInvitationLink(GenerateInvitationDto generateInvitationDto);
    Task<bool> InvalidateInvitationLink(int invitationLinkId);
    Task<InvitationLink?> GetUsableInvitationLink(string invitationLinkKey); 
    Task<List<InvitationLink>> GetInvitationLinks();
}