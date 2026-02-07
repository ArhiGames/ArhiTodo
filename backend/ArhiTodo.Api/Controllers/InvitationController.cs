using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api/invitation")]
public class InvitationController(IInvitationService invitationService) : ControllerBase
{
    [Authorize(Policy = nameof(UserClaimTypes.InviteOtherUsers))]
    [HttpPost("generate")]
    public async Task<IActionResult> GenerateInvitationLink([FromBody] GenerateInvitationDto generateInvitationDto)
    {
        InvitationLink? createdInvitationLink = await invitationService.GenerateInvitationLink(generateInvitationDto);
        if (createdInvitationLink == null) return NotFound();
        return Ok(createdInvitationLink);
    }

    [Authorize(Policy = nameof(UserClaimTypes.InviteOtherUsers))]
    [HttpPatch("invalidate/{invitationLinkId:int}")]
    public async Task<IActionResult> InvalidateInvitationLink(int invitationLinkId)
    {
        bool succeeded = await invitationService.InvalidateInvitationLink(invitationLinkId);
        if (!succeeded) return NotFound();
        return Ok();
    }

    [Authorize(Policy = nameof(UserClaimTypes.InviteOtherUsers))]
    [HttpGet]
    public async Task<IActionResult> GetInvitationLinks()
    {
        List<InvitationLink> invitationLinks = await invitationService.GetInvitationLinks();
        return Ok(invitationLinks);
    }
}