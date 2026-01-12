using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Route("auth/")]
[ApiController]
public class AccountController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateAccountDto createAccountDto)
    {
        bool succeeded = await authService.CreateAccount(createAccountDto);
        if (!succeeded) return Unauthorized();
        return Ok();
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        LoginGetDto? loginGetDto = await authService.Login(loginDto, Request.Headers.UserAgent.ToString());
        if (loginGetDto == null) return Unauthorized("Wrong credentials!");

        List<Claim> claims = [
            new(ClaimTypes.Authentication, loginGetDto.RefreshToken)
        ];

        AuthenticationProperties authenticationProperties = new()
        {
            ExpiresUtc = DateTime.UtcNow.AddDays(14),
            IsPersistent = true
        };
        
        ClaimsIdentity claimsIdentity = new(claims, "RefreshTokenCookie");

        await HttpContext.SignInAsync("AuthRefreshCookie",
            new ClaimsPrincipal(claimsIdentity),
            authenticationProperties);
        
        return Ok(new { token = loginGetDto.JwtToken });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        string? refreshToken = Request.Cookies["AuthRefreshCookie"];
        if (refreshToken == null) return Unauthorized();
        
        Claim? claim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (claim == null) return Unauthorized();
        
        Guid userId = Guid.Parse(claim.Value);
        
        bool succeeded = await authService.Logout(userId, refreshToken, Request.Headers.UserAgent.ToString());
        if (!succeeded) return Unauthorized();
        
        await HttpContext.SignOutAsync("AuthRefreshCookie");
        return Ok();
    }
}