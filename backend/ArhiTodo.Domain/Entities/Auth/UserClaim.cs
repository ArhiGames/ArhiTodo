namespace ArhiTodo.Domain.Entities.Auth;

public class UserClaim
{
    public required string Type { get; set; }
    
    public required string Value { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}