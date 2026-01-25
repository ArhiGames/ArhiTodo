using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface IInvitationService
{
    Task<InvitationLink?> GenerateInvitationLink(ClaimsPrincipal user, GenerateInvitationDto generateInvitationDto);
    Task<bool> InvalidateInvitationLink(int invitationLinkId);
    Task<List<InvitationLink>> GetInvitationLinks();
}