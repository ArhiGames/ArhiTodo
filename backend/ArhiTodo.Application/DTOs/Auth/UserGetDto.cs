namespace ArhiTodo.Application.DTOs.Auth;

public class UserGetDto
{
    public Guid UserId { get; set; } 

    public DateTimeOffset CreatedAt { get; set; } 
    
    public required string UserName { get; set; }

    public required string Email { get; set; }

    public string? JoinedViaInvitationKey { get; set; } = string.Empty;
}