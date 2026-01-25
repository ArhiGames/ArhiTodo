using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api/invitation")]
public class InvitationController(IInvitationService invitationService) : ControllerBase
{
    [HttpPost("generate")]
    //[Authorize(Policy = "InviteUsers")]
    public async Task<IActionResult> GenerateInvitationLink([FromBody] GenerateInvitationDto generateInvitationDto)
    {
        InvitationLink? createdInvitationLink = await invitationService.GenerateInvitationLink(User, generateInvitationDto);
        if (createdInvitationLink == null) return NotFound();
        return Ok(createdInvitationLink);
    }

    [HttpPatch("invalidate/{invitationLinkId:int}")]
    //[Authorize(Policy = "InviteUsers")]
    public async Task<IActionResult> InvalidateInvitationLink(int invitationLinkId)
    {
        bool succeeded = await invitationService.InvalidateInvitationLink(invitationLinkId);
        if (!succeeded) return NotFound();
        return Ok();
    }

    [HttpGet]
    //[Authorize(Policy = "InviteUsers")]
    public async Task<IActionResult> GetInvitationLinks()
    {
        List<InvitationLink> invitationLinks = await invitationService.GetInvitationLinks();
        return Ok(invitationLinks);
    }
}