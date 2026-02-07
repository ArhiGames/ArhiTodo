using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
public class ApiControllerBase : ControllerBase
{
    protected IActionResult HandleFailure(Result result)
    {
        if (result.Error == null)
        {
            return StatusCode(500, "An unknown error occurred");
        }

        return result.Error.ErrorType switch
        {
            ErrorType.Unknown => StatusCode(500, result.Error.Description),
            ErrorType.Unauthenticated => Unauthorized(result.Error.Description),
            ErrorType.Forbidden => Forbid(result.Error.Description),
            ErrorType.PasswordRequirements => BadRequest(result.Error.Description),
            ErrorType.InvalidInvitationLink => BadRequest(result.Error.Description),
            ErrorType.NotFound => NotFound(result.Error.Description),
            _ => throw new ArgumentOutOfRangeException(nameof(result))
        };
    }
}