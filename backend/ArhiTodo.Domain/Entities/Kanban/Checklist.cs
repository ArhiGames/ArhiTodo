using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Checklist
{
    public int CardId { get; private set; }
    public Card Card { get; } = null!;
    
    public int ChecklistId { get; private set; }
    public string ChecklistName { get; private set; } = string.Empty;

    private readonly List<ChecklistItem> _checklistItems = [];
    public IReadOnlyCollection<ChecklistItem> ChecklistItems => _checklistItems.AsReadOnly();
    
    private Checklist() { }

    private Checklist(int cardId, string checklistName)
    {
        CardId = cardId;
        ChecklistName = checklistName;
    }
    
    private static Result ValidateChecklistName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 1 || name.Length > 32)
        {
            return new Error("InvalidChecklistName", ErrorType.BadRequest, "The checklist name must contain between 1-32 characters!");
        }

        return Result.Success();
    }

    public static Result<Checklist> Create(int cardId, string checklistName)
    {
        Result validateChecklistNameResult = ValidateChecklistName(checklistName);
        return validateChecklistNameResult.IsSuccess
            ? new Checklist(cardId, checklistName)
            : validateChecklistNameResult.Error!;
    }

    public Result RenameChecklist(string checklistName)
    {
        Result validateChecklistNameResult = ValidateChecklistName(checklistName);
        if (!validateChecklistNameResult.IsSuccess) return validateChecklistNameResult;
        
        ChecklistName = checklistName;
        return Result.Success();
    }

    public Result<ChecklistItem> AddChecklistItem(string checklistItemName)
    {
        Result<ChecklistItem> addChecklistItemResult = ChecklistItem.Create(checklistItemName);
        if (!addChecklistItemResult.IsSuccess) return addChecklistItemResult.Error!;
        
        _checklistItems.Add(addChecklistItemResult.Value!);
        return addChecklistItemResult.Value!;
    }

    public Result RemoveChecklistItem(int checklistItemId)
    {
        ChecklistItem? checklistItem = _checklistItems.FirstOrDefault(ci => ci.ChecklistItemId == checklistItemId);
        if (checklistItem == null)
        {
            return new Error("NoChecklistItemWithId", ErrorType.Conflict,
                "There is no checklist item with the specified id on this checklist!");
        }
        return _checklistItems.Remove(checklistItem) ? Result.Success() : Errors.Unknown;
    }
}