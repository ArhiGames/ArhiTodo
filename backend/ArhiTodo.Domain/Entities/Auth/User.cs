using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Entities.Auth;

public class User
{
    public Guid UserId { get; set; } = Guid.NewGuid();

    public DateTimeOffset CreatedAt { get; set;  } = DateTimeOffset.UtcNow;
    
    public required string UserName { get; set; }

    public required string Email { get; set; }
    
    public required string HashedPassword { get; init; }

    public string? JoinedViaInvitationKey { get; set; } = string.Empty;

    public List<Project> OwningProjects { get; set; } = new();
    public List<Board> OwningBoards { get; set; } = new();
    public List<UserSession> UserSessions { get; set; } = new();
    public List<UserClaim> UserClaims { get; set; } = new();
    public List<BoardUserClaim> BoardUserClaims { get; set; } = new();
}