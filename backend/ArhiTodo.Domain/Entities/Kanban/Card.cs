using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Helpers;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Card
{
    public int CardListId { get; private set; }
    public CardList CardList { get; } = null!;
    
    public int CardId { get; init; }
    public string Position { get; private set; } = string.Empty;
    public string CardName { get; private set; } = string.Empty;
    public string CardDescription { get; private set; } = string.Empty;
    public bool IsDone { get; private set; }
    
    private readonly List<Checklist> _checklists = [];
    public IReadOnlyCollection<Checklist> Checklists => _checklists.AsReadOnly();
    
    private readonly List<CardLabel> _labels = [];
    public IReadOnlyCollection<CardLabel> Labels => _labels.AsReadOnly();

    private Card() { }

    private Card(int cardListId, string cardName, string prevLocation)
    {
        CardListId = cardListId;
        CardName = cardName;
        Position = prevLocation;
    }

    private static Result ValidateCardName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 1 || name.Length > 256)
        {
            return new Error("InvalidCardName", ErrorType.BadRequest, "The Card name must contain between 1-256 characters!");
        }

        return Result.Success();
    }

    public static Result<Card> Create(int cardListId, string cardName, string prevLocation)
    {
        Result validateCardNameResult = ValidateCardName(cardName);
        return validateCardNameResult.IsSuccess ? new Card(cardListId, cardName, 
            LexicalOrderHelper.GetBetween(prevLocation, null)) : validateCardNameResult.Error!;
    }

    public Result MoveCard(string? prevLocation, string? nextLocation)
    {
        string newLocation = LexicalOrderHelper.GetBetween(prevLocation, nextLocation);
        Position = newLocation;
        return Result.Success();
    }
    
    public Result RenameCard(string cardName)
    {
        Result validateCardNameResult = ValidateCardName(cardName);
        if (!validateCardNameResult.IsSuccess) return validateCardNameResult;
        
        CardName = cardName;
        return Result.Success();
    }

    public void ChangeCardDescription(string cardDescription)
    {
        CardDescription = cardDescription;
    }

    public void UpdateCardState(bool isDone)
    {
        IsDone = isDone;
    }

    public void AddChecklist(Checklist checklist)
    {
        _checklists.Add(checklist);
    }

    public Result RemoveChecklist(int checklistId)
    {
        Checklist? checklist = _checklists.FirstOrDefault(cl => cl.ChecklistId == checklistId);
        if (checklist == null)
        {
            return new Error("NoChecklistWithId", ErrorType.Conflict,
                "There is no checklist with the specified id on this card!");
        }
        return _checklists.Remove(checklist) ? Result.Success() : Errors.Unknown;
    }

    public ChecklistItem? UpdateChecklistItemState(int checklistItemId, bool isDone)
    {
        foreach (Checklist checklist in _checklists)
        {
            ChecklistItem? checklistItem =
                checklist.ChecklistItems.FirstOrDefault(ci => ci.ChecklistItemId == checklistItemId);
            if (checklistItem != null)
            {
                checklistItem.UpdateChecklistItemState(isDone);
                return checklistItem;
            }
        }
        return null;
    }

    public void AddLabel(Label label)
    {
        _labels.Add(new CardLabel(label.LabelId, CardId));
    }

    public Result RemoveLabel(int labelId)
    {
        CardLabel? label = _labels.FirstOrDefault(l => l.LabelId == labelId);
        if (label == null)
        {
            return new Error("NoLabelWithId", ErrorType.Conflict,
                "There is no label with the specified id on this card!");
        }
        return _labels.Remove(label) ? Result.Success() : Errors.Unknown;
    }
}