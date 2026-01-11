namespace ArhiTodo.Domain.Entities.Kanban;

public class Checklist
{
    public int ChecklistId { get; set; }
    
    public required string ChecklistName { get; set; }

    public List<ChecklistItem> ChecklistItems { get; set; } = [];
    
    public int CardId { get; set; }
    public Card Card { get; set; } = null!;
}