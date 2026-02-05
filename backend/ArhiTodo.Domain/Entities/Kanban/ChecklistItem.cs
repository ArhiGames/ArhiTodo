namespace ArhiTodo.Domain.Entities.Kanban;

public class ChecklistItem
{
    public int ChecklistId { get; private set; }
    
    public int ChecklistItemId { get; set; }
    public string ChecklistItemName { get; set; } = string.Empty;
    public bool IsDone { get; set; }

    private ChecklistItem() { }

    public ChecklistItem(string checklistItemName)
    {
        ChecklistItemName = checklistItemName;
    }
}