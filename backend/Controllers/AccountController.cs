using System.Security.Claims;
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
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    
    public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IUserRepository userRepository, ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            AppUser user = new()
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
            };
            
            IdentityResult identityResult = await _userManager.CreateAsync(user, registerDto.Password);

            if (!identityResult.Succeeded) return StatusCode(500, identityResult.Errors);
            
            IList<Claim> claims = await _userManager.GetClaimsAsync(user);
            return Ok(new UserRegisterLoginDto()
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
            return Unauthorized("Invalid user name!");
        }

        SignInResult signInAsync = await _signInManager.CheckPasswordSignInAsync(appUser, loginDto.Password, false);

        if (!signInAsync.Succeeded) return Unauthorized("Wrong password!");

        IList<Claim> claims = await _userManager.GetClaimsAsync(appUser);
        
        return Ok(new UserRegisterLoginDto()
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
        AppUser? appUser = await _userManager.FindByIdAsync(userId);
        if (appUser == null)
        {
            return NotFound();
        }

        if (appUser.UserName == "admin")
        {
            return Conflict("The claims of the admin user cannot be changed!");
        }
        
        try
        {
            int changedClaims = await _userRepository.UpdateUserClaims(appUser, updatedClaims);
            return Ok(changedClaims);
        }
        catch (InvalidOperationException)
        {
            return Unauthorized();
        }
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
        
        try
        {
            UserUserManagementGetDto userManagementGetDto = await _userRepository.GetUserWithClaimsAsync(appUser);
            return Ok(userManagementGetDto);
        }
        catch (InvalidOperationException)
        {
            return Unauthorized();
        }
    }
}