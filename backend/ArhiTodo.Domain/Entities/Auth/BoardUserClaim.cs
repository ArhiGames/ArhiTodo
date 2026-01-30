using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Entities.Auth;

public class BoardUserClaim
{
    public required string Type { get; set; }
    
    public required string Value { get; set; }
    
    public required int BoardId { get; set; }
    public Board Board { get; set; } = null!;
    
    public required Guid UserId { get; set; }
    public User User { get; set; } = null!;
}