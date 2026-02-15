using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Auth;

[Route("api/")]
[ApiController]
public class UserController(IUserService userService) : ApiControllerBase
{
    [Authorize(Policy = nameof(UserClaimTypes.ManageUsers))]
    [HttpPut("user/{userId:guid}/claims")]
    public async Task<IActionResult> UpdateClaims(Guid userId, [FromBody] List<ClaimPostDto> claimPostDtos)
    {
        Result<List<ClaimGetDto>> claimGetDtos = await userService.UpdateClaims(userId, claimPostDtos);
        return claimGetDtos.IsSuccess ? Ok(claimGetDtos.Value) : HandleFailure(claimGetDtos);
    }
}