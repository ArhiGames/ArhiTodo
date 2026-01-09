namespace ArhiTodo.Domain.Entities;

public class Board
{
    public int BoardId { get; set; }

    public string BoardName { get; set; } = string.Empty;
    
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    
    public List<CardList> CardLists { get; set; } = new();
    public List<Label> Labels { get; set; } = new();
}