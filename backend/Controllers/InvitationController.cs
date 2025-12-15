using System.Security.Claims;
using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api/invitation")]
public class InvitationController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IInvitationRepository _invitationRepository;

    public InvitationController(UserManager<AppUser> userManager, IInvitationRepository invitationRepository)
    {
        _userManager = userManager;
        _invitationRepository = invitationRepository;
    }
    
    [HttpPost("invitationlink/generate")]
    [Authorize(Policy = "InviteUsers")]
    public async Task<IActionResult> GenerateInvitationLink()
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        AppUser? appUser = await _userManager.FindByIdAsync(userId);
        if (appUser == null)
        {
            return Unauthorized();
        }
        
        InvitationLink createdInvitationLink = await _invitationRepository.GenerateInvitationLink(appUser);
        return Ok(createdInvitationLink);
    }

    [HttpPatch("invitationlink/invalidate/{invitationLinkId:int}")]
    [Authorize(Policy = "InviteUsers")]
    public async Task<IActionResult> InvalidateInvitationLink(int invitationLinkId)
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        AppUser? appUser = await _userManager.FindByIdAsync(userId);
        if (appUser == null)
        {
            return Unauthorized();
        }

        try
        {
            bool bChanged = await _invitationRepository.InvalidateInvitationLink(invitationLinkId);
            if (bChanged)
            {
                return Ok();
            }

            return NotFound();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}