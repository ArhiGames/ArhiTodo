namespace ArhiTodo.Domain.Entities.Kanban;

public class Checklist
{
    public int CardId { get; private set; }
    
    public int ChecklistId { get; private set; }
    public string ChecklistName { get; private set; } = string.Empty;

    private readonly List<ChecklistItem> _checklistItems = [];
    public IReadOnlyCollection<ChecklistItem> ChecklistItems => _checklistItems.AsReadOnly();
    
    private Checklist() { }

    public Checklist(int cardId, string checklistName)
    {
        CardId = cardId;
        ChecklistName = checklistName;
    }

    public void RenameChecklist(string checklistName)
    {
        ChecklistName = checklistName;
    }

    public ChecklistItem AddChecklistItem(string checklistItemName)
    {
        ChecklistItem checklistItem = new(checklistItemName);
        _checklistItems.Add(checklistItem);
        return checklistItem;
    }

    public bool RemoveChecklistItem(int checklistItemId)
    {
        ChecklistItem? checklistItem = _checklistItems.FirstOrDefault(ci => ci.ChecklistItemId == checklistItemId);
        if (checklistItem == null)
        {
            throw new NothingToDeleteException("There is no checklist item with the specified id on this checklist");
        }
        return _checklistItems.Remove(checklistItem);
    }
}