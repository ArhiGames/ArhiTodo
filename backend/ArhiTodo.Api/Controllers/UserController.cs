using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Services.Interfaces.Auth;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Route("api/")]
[ApiController]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost("user/{userId:guid}/claim")]
    public async Task<IActionResult> GrantClaim(Guid userId, [FromBody] ClaimPostDto claimPostDto)
    {
        ClaimGetDto? claimGetDto = await userService.GrantClaim(userId, claimPostDto);
        if (claimGetDto == null) return NotFound();
        return Ok(claimGetDto);
    }

    [HttpDelete("user/{userId:guid}/claim/{claimType}")]
    public async Task<IActionResult> RevokeClaim(Guid userId, string claimType)
    {
        bool succeeded = await userService.RevokeClaim(userId, claimType);
        if (!succeeded) return NotFound();
        return Ok();
    }
}