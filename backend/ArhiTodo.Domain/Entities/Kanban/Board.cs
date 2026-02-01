using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Board
{
    public int BoardId { get; set; }

    public string BoardName { get; set; } = string.Empty;
    
    public required Guid OwnedByUserId { get; set; }
    public User Owner { get; set; } = null!;
    
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public List<BoardUserClaim> BoardUserClaims { get; set; } = new();
    public List<CardList> CardLists { get; set; } = new();
    public List<Label> Labels { get; set; } = new();
}