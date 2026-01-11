namespace ArhiTodo.Domain.Entities.Auth;

public class UserSession
{
    public Guid SessionId { get; } = Guid.NewGuid();
    
    public required Guid UserId { get; set; }
    
    public required string TokenHash { get; set; }
    
    public required DateTimeOffset ExpiresAt { get; set; }
    
    public required string UserAgent { get; set; }

    public User User { get; set; } = null!;
}