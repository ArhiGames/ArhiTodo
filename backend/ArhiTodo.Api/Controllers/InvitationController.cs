namespace ArhiTodo.Controllers;

// @Todo
/*[ApiController]
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
    
    [HttpPost("generate")]
    [Authorize(Policy = "InviteUsers")]
    public async Task<IActionResult> GenerateInvitationLink([FromBody] GenerateInvitationDto generateInvitationDto)
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
        
        InvitationLink createdInvitationLink = await _invitationRepository.GenerateInvitationLinkAsync(appUser, generateInvitationDto);
        return Ok(createdInvitationLink);
    }

    [HttpPatch("invalidate/{invitationLinkId:int}")]
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

        bool bChanged = await _invitationRepository.InvalidateInvitationLinkAsync(invitationLinkId);
        if (bChanged)
        {
            return Ok();
        }

        return NotFound();
    }

    [HttpGet]
    [Authorize(Policy = "InviteUsers")]
    public async Task<IActionResult> GetInvitationLinks()
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

        List<InvitationLink> invitationLinks = await _invitationRepository.GetAllInvitationLinksAsync();
        return Ok(invitationLinks);
    }
}*/