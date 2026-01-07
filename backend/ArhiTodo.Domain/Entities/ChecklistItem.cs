namespace ArhiTodo.Domain.Entities;

public class ChecklistItem
{
    public int ChecklistItemId { get; set; }

    public required string ChecklistItemName { get; set; }
    
    public bool IsDone { get; set; }
    
    public int ChecklistId { get; set; }
    public Checklist Checklist { get; set; } = null!;
}