using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Authentication;

public interface IInvitationService
{
    Task<Result<InvitationLinkGetDto>> GenerateInvitationLink(GenerateInvitationDto generateInvitationDto);
    Task<Result<List<InvitationLinkGetDto>>> GetInvitationLinks();
    Task<Result> InvalidateInvitationLink(int invitationLinkId);
}