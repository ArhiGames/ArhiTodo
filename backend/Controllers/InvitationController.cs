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
    
    [HttpPost("generate/invitationlink")]
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
}