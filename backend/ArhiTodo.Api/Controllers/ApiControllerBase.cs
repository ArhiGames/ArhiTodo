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
            ErrorType.Unknown => StatusCode(500, new { type = result.Error.ErrorType.ToString(), message = result.Error.Description} ),
            ErrorType.Unauthenticated => Unauthorized(new { type = result.Error.ErrorType.ToString(), message = result.Error.Description} ),
            ErrorType.Forbidden => StatusCode(StatusCodes.Status403Forbidden, new { type = result.Error.ErrorType.ToString(), message = result.Error.Description} ),
            ErrorType.PasswordRequirements => BadRequest(new { type = result.Error.ErrorType.ToString(), message = result.Error.Description} ),
            ErrorType.InvalidInvitationLink => BadRequest(new { type = result.Error.ErrorType.ToString(), message = result.Error.Description} ),
            ErrorType.NotFound => NotFound(new { type = result.Error.ErrorType.ToString(), message = result.Error.Description} ),
            ErrorType.BadRequest => BadRequest(new { type = result.Error.ErrorType.ToString(), message = result.Error.Description} ),
            ErrorType.Conflict => Conflict(new { type = result.Error.ErrorType.ToString(), message = result.Error.Description} ),
            _ => throw new ArgumentOutOfRangeException(nameof(result))
        };
    }
}