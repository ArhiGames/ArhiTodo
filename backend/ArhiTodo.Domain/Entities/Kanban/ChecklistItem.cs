using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Domain.Entities.Kanban;

public class ChecklistItem
{
    public int ChecklistId { get; private set; }
    public Checklist Checklist { get; } = null!;
    
    public int ChecklistItemId { get; private set; }
    public string Position { get; private set; } = string.Empty;
    public string ChecklistItemName { get; private set; } = string.Empty;
    public bool IsDone { get; private set; }

    private ChecklistItem() { }

    private ChecklistItem(string checklistItemName)
    {
        ChecklistItemName = checklistItemName;
    }
    
    private static Result ValidateChecklistItemName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 1 || name.Length > 256)
        {
            return new Error("InvalidChecklistItemName", ErrorType.BadRequest, "The checklist item name must contain between 1-256 characters!");
        }

        return Result.Success();
    }

    public static Result<ChecklistItem> Create(string checklistItemName)
    {
        Result validateChecklistItemNameResult = ValidateChecklistItemName(checklistItemName);
        return validateChecklistItemNameResult.IsSuccess
            ? new ChecklistItem(checklistItemName)
            : validateChecklistItemNameResult.Error!;
    }

    public Result RenameChecklistItem(string checklistItemName)
    {
        Result validateChecklistItemNameResult = ValidateChecklistItemName(checklistItemName);
        if (!validateChecklistItemNameResult.IsSuccess) return validateChecklistItemNameResult;
        
        ChecklistItemName = checklistItemName;
        return Result.Success();
    }

    public void UpdateChecklistItemState(bool isDone)
    {
        IsDone = isDone;
    }
}