using System.Security.Claims;
using ArhiTodo.Data;
using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace ArhiTodo.Controllers;

[Route("api/account")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IInvitationRepository _invitationRepository;
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    
    public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, 
        IInvitationRepository invitationRepository, IUserRepository userRepository, ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _invitationRepository = invitationRepository;
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            bool mayUseInvitationLink = await _invitationRepository.TryToUseInvitationLink(registerDto.InvitationKey);
            if (!mayUseInvitationLink)
            {
                return Unauthorized("Invalid invitation link");
            }
            
            AppUser user = new()
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
            };
            
            IdentityResult identityResult = await _userManager.CreateAsync(user, registerDto.Password);

            if (!identityResult.Succeeded)
            {
                return StatusCode(500, identityResult.Errors);
            }

            await _invitationRepository.UsedInvitationLink(user, registerDto.InvitationKey);
            
            IList<Claim> claims = await _userManager.GetClaimsAsync(user);
            return Ok(new UserRegisterLoginDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = _tokenService.CreateToken(user, claims)
            });
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        } 
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto loginDto)
    {
        AppUser? appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName! == loginDto.UserName);

        if (appUser == null)
        {
            return Unauthorized("Wrong credentials!");
        }

        SignInResult signInAsync = await _signInManager.CheckPasswordSignInAsync(appUser, loginDto.Password, false);

        if (!signInAsync.Succeeded) return Unauthorized("Wrong credentials!");

        IList<Claim> claims = await _userManager.GetClaimsAsync(appUser);
        
        return Ok(new UserRegisterLoginDto
        {
            UserName = appUser.UserName!,
            Email = appUser.Email!,
            Token = _tokenService.CreateToken(appUser, claims)
        });
    }

    [HttpPut("change/password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return NotFound();
        }
        
        AppUser? appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (appUser == null)
        {
            throw new InvalidOperationException("User not found");
        }

        IdentityResult identityResult = await _userRepository.ChangePasswordAsync(appUser, changePasswordDto);
        if (identityResult.Succeeded)
        {
            return Ok();
        }

        return Unauthorized(identityResult.Errors);
    }

    [HttpGet("admin/accountmanagement")]
    [Authorize(Policy = "ManageUsers")]
    public async Task<IActionResult> GetAllUsers()
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return NotFound();
        }
        
        AppUser? appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (appUser == null)
        {
            throw new InvalidOperationException("User not found");
        }

        List<UserUserManagementGetDto> userManagementGetDtos = await _userRepository.GetAllUsersAsync();
        return Ok(userManagementGetDtos);
    }

    [HttpPut("admin/accountmanagement/users/{userId}")]
    [Authorize(Policy = "ManageUsers")]
    public async Task<IActionResult> UpdateUserClaims(string userId, [FromBody] List<ClaimPostDto> updatedClaims)
    {
        string? requestingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (requestingUserId == null)
        {
            return Unauthorized();
        }

        foreach (ClaimPostDto claimPostDto in updatedClaims)
        {
            bool isKnownClaim = Constants.Claims.Any(claim => claim.Type == claimPostDto.Type);
            if (!isKnownClaim)
            {
                return Conflict("The claim " + claimPostDto.Type + " doesn't exist!");
            }
        }
        
        AppUser? appUser = await _userManager.FindByIdAsync(userId);
        if (appUser == null)
        {
            return NotFound();
        }

        if (appUser.UserName == "admin")
        {
            return Conflict("The claims of the admin user cannot be changed!");
        }

        if (appUser.Id == requestingUserId)
        {
            return Conflict("Cannot update the claims of yourself!");
        }
        
        int changedClaims = await _userRepository.UpdateUserClaims(appUser, updatedClaims);
        return Ok(changedClaims);
    }

    [HttpGet("admin/accountmanagement/users/{userId}")]
    [Authorize(Policy = "ManageUsers")]
    public async Task<IActionResult> GetUserWithClaims(string userId)
    {
        AppUser? appUser = await _userManager.FindByIdAsync(userId);
        if (appUser == null)
        {
            return NotFound();
        }
        
        UserUserManagementGetDto userManagementGetDto = await _userRepository.GetUserWithClaimsAsync(appUser);
        return Ok(userManagementGetDto);
    }

    [HttpDelete("admin/accountmanagement/users/{userToDeleteId}")]
    [Authorize(Policy = "DeleteUsers")]
    public async Task<IActionResult> DeleteUser(string userToDeleteId, [FromBody] UserPasswordDto confirmationPassword)
    {
        string? requestingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (requestingUserId == null)
        {
            return Unauthorized();
        }

        AppUser? requestingAppUser = await _userManager.FindByIdAsync(requestingUserId);
        if (requestingAppUser == null)
        {
            return Unauthorized();
        }

        bool correctPassword = await _userManager.CheckPasswordAsync(requestingAppUser, confirmationPassword.Password);
        if (!correctPassword)
        {
            return Unauthorized();
        }
        
        AppUser? userToDelete = await _userManager.FindByIdAsync(userToDeleteId);
        if (userToDelete == null)
        {
            return NotFound();
        }
        bool bSuccessful = await _userRepository.DeleteAppUser(userToDelete);
        if (bSuccessful)
        {
            return NoContent();
        }

        return Conflict("Could not delete user");
    }
}