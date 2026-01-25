using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize]
    [HttpPut("account/change/password")]
    public async Task<IActionResult> ChangePassword([FromBody] UpdatePasswordDto updatePasswordDto)
    {
        bool succeeded = await authService.ChangePassword(User, updatePasswordDto);
        await HttpContext.SignOutAsync("AuthRefreshCookie");
        if (!succeeded) return Unauthorized();
        return Ok();
    }

    [Authorize(AuthenticationSchemes = "AuthRefreshCookie")]
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshJwtToken()
    { 
        string? refreshToken = User.FindFirstValue(ClaimTypes.Authentication);
        if (refreshToken == null) return Unauthorized();

        string? jwt = await authService.RefreshJwtToken(refreshToken);
        if (jwt == null) return Unauthorized();

        return Ok(new { token = jwt });
    } 

    [Authorize(AuthenticationSchemes = "JwtUnvalidatedLifetime")]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("AuthRefreshCookie");
        
        bool succeeded = await authService.Logout(User, Request.Headers.UserAgent.ToString());
        if (!succeeded) return Unauthorized();
        
        return Ok();
    }

    [Authorize]
    [HttpDelete("logout-all/{userId:guid}")]
    public async Task<IActionResult> LogoutEverySession(Guid userId)
    {
        bool succeeded = await authService.LogoutEveryDevice(userId);
        if (!succeeded) return Unauthorized();
        return Ok();
    } 
}