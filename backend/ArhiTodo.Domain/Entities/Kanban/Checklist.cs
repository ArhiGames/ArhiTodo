namespace ArhiTodo.Domain.Entities.Kanban;

public class Checklist
{
    public int CardId { get; private set; }
    
    public int ChecklistId { get; private set; }
    public string ChecklistName { get; private set; } = string.Empty;

    private readonly List<ChecklistItem> _checklistItems = [];
    public IReadOnlyCollection<ChecklistItem> ChecklistItems => _checklistItems.AsReadOnly();
    
    private Checklist() { }

    public Checklist(string checklistName)
    {
        ChecklistName = checklistName;
    }

    public void AddChecklistItem(string checklistItemName)
    {
        ChecklistItem checklistItem = new(checklistItemName);
        _checklistItems.Add(checklistItem);
    }
}