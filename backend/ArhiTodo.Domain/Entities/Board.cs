namespace ArhiTodo.Domain.Entities;

public class Board
{
    public int BoardId { get; set; }
    
    public required string BoardName { get; set; }
    
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    
    public List<CardList> CardLists { get; set; } = new();
    public List<Label> Labels { get; set; } = new();
}