namespace ArhiTodo.Domain.Entities.Kanban;

public class ChecklistItem
{
    public int ChecklistId { get; private set; }
    
    public int ChecklistItemId { get; private set; }
    public string ChecklistItemName { get; private set; } = string.Empty;
    public bool IsDone { get; private set; }

    private ChecklistItem() { }

    public ChecklistItem(string checklistItemName)
    {
        ChecklistItemName = checklistItemName;
    }

    public void RenameChecklistItem(string checklistItemName)
    {
        ChecklistItemName = checklistItemName;
    }

    public void UpdateChecklistItemState(bool isDone)
    {
        IsDone = isDone;
    }
}