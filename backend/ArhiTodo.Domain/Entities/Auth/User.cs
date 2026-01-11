namespace ArhiTodo.Domain.Entities.Auth;

public class User
{
    public Guid UserId { get; } = Guid.NewGuid();

    public DateTimeOffset CreatedAt { get; } = DateTimeOffset.UtcNow;
    
    public required string UserName { get; set; }
    
    public required string HashedPassword { get; init; }

    public string? JoinedViaInvitationKey { get; set; } = string.Empty;

    public List<UserSession> UserSessions { get; set; } = new();
}