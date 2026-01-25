namespace ArhiTodo.Application.DTOs.Auth;

public record CreateAccountDto(string Username, string Email, string Password, string InvitationKey);