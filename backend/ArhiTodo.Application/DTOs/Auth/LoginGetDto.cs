namespace ArhiTodo.Application.DTOs.Auth;

public record LoginGetDto(string JwtToken, string RefreshToken);