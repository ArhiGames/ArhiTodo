using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Application.Services.Interfaces.Authentication;

public interface IInvitationService
{
    Task<Result<InvitationLink>> GenerateInvitationLink(GenerateInvitationDto generateInvitationDto);
    Task<Result<List<InvitationLink>>> GetInvitationLinks();
    Task<Result> InvalidateInvitationLink(int invitationLinkId);
}