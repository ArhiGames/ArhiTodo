namespace ArhiTodo.Application.DTOs.Auth;

public record LoginGetDto(Guid UserId, string JwtToken, string RefreshToken);