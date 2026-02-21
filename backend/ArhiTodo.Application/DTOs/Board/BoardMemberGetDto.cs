namespace ArhiTodo.Application.DTOs.Board;

public class BoardMemberGetDto
{
    public Guid UserId { get; set; } 
    
    public required string UserName { get; set; }

    public required string Email { get; set; }
}