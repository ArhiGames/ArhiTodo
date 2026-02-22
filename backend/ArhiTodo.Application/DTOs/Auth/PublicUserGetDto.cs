namespace ArhiTodo.Application.DTOs.Auth;

public class PublicUserGetDto
{
    public Guid UserId { get; set; } 
    
    public required string UserName { get; set; }

    public required string Email { get; set; }
}