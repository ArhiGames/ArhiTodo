using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Accounts;
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
    private readonly ITokenService _tokenService;
    
    public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
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

            if (identityResult.Succeeded)
            {
                return Ok(new UserGetDto()
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user)
                });
            }

            return StatusCode(500, identityResult.Errors);
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

        return Ok(new UserGetDto()
        {
            UserName = appUser.UserName!,
            Email = appUser.Email!,
            Token = _tokenService.CreateToken(appUser)
        });
    }
}