using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Route("auth/")]
[ApiController]
public class AccountController(IUserService userService, IAuthService authService) : ControllerBase
{
    [Authorize(Policy = nameof(UserClaimTypes.ManageUsers))]
    [HttpGet("accounts/{page:int}")]
    public async Task<IActionResult> GetAccounts(int page, [FromQuery] bool? includeGlobalPermissions, 
        [FromQuery] int? boardPermissionsBoardId)
    {
        List<UserGetDto> users = await userService.GetUsers(page, includeGlobalPermissions ?? false, boardPermissionsBoardId);
        return Ok(users);
    }

    [Authorize(Policy = nameof(UserClaimTypes.ManageUsers))]
    [HttpGet("accounts/count")]
    public async Task<IActionResult> GetUserCount()
    {
        int userCount = await userService.GetUserCount();
        return Ok(new { userCount });
    }

    [Authorize(Policy = nameof(UserClaimTypes.ManageUsers))]
    [HttpGet("accounts/user/{userId:guid}")]
    public async Task<IActionResult> GetUserAccount(Guid userId)
    {
        UserGetDto? user = await userService.GetUser(userId);
        if (user == null) return NotFound();
        return Ok(user);
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateAccountDto createAccountDto)
    {
        PasswordAuthorizerResult passwordAuthorizerResult = await authService.CreateAccount(createAccountDto);
        if (!passwordAuthorizerResult.Succeeded) return Unauthorized(passwordAuthorizerResult);
        return Ok(passwordAuthorizerResult);
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
        PasswordAuthorizerResult passwordAuthorizerResult = await authService.ChangePassword(updatePasswordDto);
        if (!passwordAuthorizerResult.Succeeded) return Unauthorized(passwordAuthorizerResult);
        await HttpContext.SignOutAsync("AuthRefreshCookie");
        return Ok(passwordAuthorizerResult);
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
        
        bool succeeded = await authService.Logout(Request.Headers.UserAgent.ToString());
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

    [Authorize(Policy = nameof(UserClaimTypes.DeleteUsers))]
    [HttpDelete("accounts/user/{userId:guid}")]
    public async Task<IActionResult> DeleteAccount(Guid userId)
    {
        bool succeeded = await authService.DeleteAccount(userId);
        if (!succeeded) return NotFound();
        return NoContent();
    }
}