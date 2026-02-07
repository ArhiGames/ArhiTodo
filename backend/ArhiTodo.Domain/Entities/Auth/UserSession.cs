namespace ArhiTodo.Domain.Entities.Auth;

public class UserSession
{
    public Guid SessionId { get; init; } = Guid.NewGuid();
    
    public string TokenHash { get; private set; } = string.Empty;
    
    public string UserAgent { get; private set; } = string.Empty;
    
    public DateTimeOffset ExpiresAt { get; private set; }
    
    public Guid UserId { get; private set; }
    public User User { get; } = null!;
    
    private UserSession() { }

    public UserSession(Guid userId, string tokenHash, string userAgent, DateTimeOffset expireDate)
    {
        UserId = userId;
        TokenHash = tokenHash;
        UserAgent = userAgent;
        ExpiresAt = expireDate;
    }

    public void UpdateUserSession(DateTimeOffset expiresAt, string tokenHash)
    {
        ExpiresAt = expiresAt;
        TokenHash = tokenHash;
    }
}