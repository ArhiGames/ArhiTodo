using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Auth;

[ApiController]
[Route("api/invitation")]
public class InvitationController(IInvitationService invitationService) : ApiControllerBase
{
    [Authorize(Policy = nameof(UserClaimTypes.InviteOtherUsers))]
    [HttpPost("generate")]
    public async Task<IActionResult> GenerateInvitationLink([FromBody] GenerateInvitationDto generateInvitationDto)
    {
        Result<InvitationLink> createdInvitationLink = await invitationService.GenerateInvitationLink(generateInvitationDto);
        return createdInvitationLink.IsSuccess ? Ok(createdInvitationLink.Value) : HandleFailure(createdInvitationLink);
    }

    [Authorize(Policy = nameof(UserClaimTypes.InviteOtherUsers))]
    [HttpPatch("invalidate/{invitationLinkId:int}")]
    public async Task<IActionResult> InvalidateInvitationLink(int invitationLinkId)
    {
        Result invalidateInvitationLinkResult = await invitationService.InvalidateInvitationLink(invitationLinkId);
        return invalidateInvitationLinkResult.IsSuccess ? Ok() : HandleFailure(invalidateInvitationLinkResult);
    }

    [Authorize(Policy = nameof(UserClaimTypes.InviteOtherUsers))]
    [HttpGet]
    public async Task<IActionResult> GetInvitationLinks()
    {
        Result<List<InvitationLink>> invitationLinks = await invitationService.GetInvitationLinks();
        return invitationLinks.IsSuccess ? Ok(invitationLinks.Value) : HandleFailure(invitationLinks);
    }
}