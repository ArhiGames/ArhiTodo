using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Services.Interfaces.Auth;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Route("api/")]
[ApiController]
public class UserController(IUserService userService) : ControllerBase
{
    
    [HttpPut("user/{userId:guid}/claims")]
    public async Task<IActionResult> UpdateClaims(Guid userId, [FromBody] List<ClaimPostDto> claimPostDtos)
    {
        List<ClaimGetDto>? claimGetDtos = await userService.UpdateClaims(userId, claimPostDtos);
        if (claimGetDtos == null) return NotFound();
        return Ok(claimGetDtos);
    }
}