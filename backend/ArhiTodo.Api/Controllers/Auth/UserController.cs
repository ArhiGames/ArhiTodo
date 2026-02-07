using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Auth;

[Route("api/")]
[ApiController]
public class UserController(IUserService userService) : ControllerBase
{
    [Authorize(Policy = nameof(UserClaimTypes.ManageUsers))]
    [HttpPut("user/{userId:guid}/claims")]
    public async Task<IActionResult> UpdateClaims(Guid userId, [FromBody] List<ClaimPostDto> claimPostDtos)
    {
        List<ClaimGetDto>? claimGetDtos = await userService.UpdateClaims(userId, claimPostDtos);
        if (claimGetDtos == null) return NotFound();
        return Ok(claimGetDtos);
    }
}