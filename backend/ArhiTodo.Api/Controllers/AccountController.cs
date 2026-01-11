using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Auth;
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
        string? token = await authService.Login(loginDto, Request.Headers.UserAgent.ToString());
        if (token == null) return Unauthorized("Wrong credentials!");
        return Ok(token);
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        string userAgent = Request.Headers.UserAgent.ToString();
        return Ok(userAgent);
    }
}