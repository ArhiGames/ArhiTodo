using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Accounts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Route("api/account")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    
    public AccountController(UserManager<AppUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
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
}