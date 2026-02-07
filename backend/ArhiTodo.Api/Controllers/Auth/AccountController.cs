using System.Security.Claims;
using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Auth;

[Route("auth/")]
[ApiController]
public class AccountController(IUserService userService, IAuthService authService) : ApiControllerBase
{
    [Authorize(Policy = nameof(UserClaimTypes.ManageUsers))]
    [HttpGet("accounts/{page:int}")]
    public async Task<IActionResult> GetAccounts(int page, [FromQuery] bool? includeGlobalPermissions, 
        [FromQuery] int? boardPermissionsBoardId)
    {
        Result<List<UserGetDto>> users = await userService.GetUsers(page, includeGlobalPermissions ?? false, boardPermissionsBoardId);
        return users.IsSuccess ? Ok(users.Value) : HandleFailure(users);
    }

    [Authorize(Policy = nameof(UserClaimTypes.ManageUsers))]
    [HttpGet("accounts/count")]
    public async Task<IActionResult> GetUserCount()
    {
        Result<int> userCount = await userService.GetUserCount();
        return userCount.IsSuccess ? Ok(new { userCount.Value }) : HandleFailure(userCount);
    }

    [Authorize(Policy = nameof(UserClaimTypes.ManageUsers))]
    [HttpGet("accounts/user/{userId:guid}")]
    public async Task<IActionResult> GetUserAccount(Guid userId)
    {
        Result<UserGetDto> user = await userService.GetUser(userId);
        return user.IsSuccess ? Ok(user.Value) : HandleFailure(user);
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateAccountDto createAccountDto)
    {
        Result passwordAuthorizerResult = await authService.CreateAccount(createAccountDto);
        return passwordAuthorizerResult.IsSuccess ? Ok() : HandleFailure(passwordAuthorizerResult);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        Result<LoginGetDto> loginGetDto = await authService.Login(loginDto, Request.Headers.UserAgent.ToString());
        if (!loginGetDto.IsSuccess) return HandleFailure(loginGetDto);

        List<Claim> claims = [
            new(ClaimTypes.NameIdentifier, loginGetDto.Value!.UserId.ToString()),
            new(ClaimTypes.Authentication, loginGetDto.Value!.RefreshToken)
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
        
        return Ok(new { token = loginGetDto.Value.JwtToken });
    }

    [Authorize]
    [HttpPut("account/change/password")]
    public async Task<IActionResult> ChangePassword([FromBody] UpdatePasswordDto updatePasswordDto)
    {
        Result passwordAuthorizerResult = await authService.ChangePassword(updatePasswordDto);
        
        if (!passwordAuthorizerResult.IsSuccess) return HandleFailure(passwordAuthorizerResult);
        
        await HttpContext.SignOutAsync("AuthRefreshCookie");
        return Ok(passwordAuthorizerResult);
    }

    [Authorize(AuthenticationSchemes = "AuthRefreshCookie")]
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshJwtToken()
    { 
        string? refreshToken = User.FindFirstValue(ClaimTypes.Authentication);
        if (refreshToken == null) return Unauthorized();

        Result<string> jwt = await authService.RefreshJwtToken(refreshToken);
        return jwt.IsSuccess ? Ok(new { token = jwt.Value }) : HandleFailure(jwt);
    } 

    [Authorize(AuthenticationSchemes = "JwtUnvalidatedLifetime")]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("AuthRefreshCookie");
        
        Result logoutResult = await authService.Logout(Request.Headers.UserAgent.ToString());
        return logoutResult.IsSuccess ? Ok() : HandleFailure(logoutResult);
    }

    [Authorize]
    [HttpDelete("logout-all/{userId:guid}")]
    public async Task<IActionResult> LogoutEverySession(Guid userId)
    {
        Result logoutResult = await authService.LogoutEveryDevice(userId);
        return logoutResult.IsSuccess ? Ok() : HandleFailure(logoutResult);
    }

    [Authorize(Policy = nameof(UserClaimTypes.DeleteUsers))]
    [HttpDelete("accounts/user/{userId:guid}")]
    public async Task<IActionResult> DeleteAccount(Guid userId)
    {
        Result deleteAccountResult = await authService.DeleteAccount(userId);
        return deleteAccountResult.IsSuccess ? NoContent() : HandleFailure(deleteAccountResult);
    }
}