using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Helpers;

namespace ArhiTodo.Domain.Entities.Kanban;

public enum CardUrgencyLevel
{
    None,
    Low,
    Medium,
    High,
    Urgent
}

public class Card : Draggable
{
    public int CardListId { get; private set; }
    public CardList CardList { get; } = null!;
    
    public int CardId { get; init; }
    public string CardName { get; private set; } = string.Empty;
    public string CardDescription { get; private set; } = string.Empty;
    public bool IsDone { get; private set; }

    public CardUrgencyLevel CardUrgencyLevel { get; private set; } = CardUrgencyLevel.None;

    private readonly List<AssignedCardUser> _assignedUsers = [];
    public IReadOnlyCollection<AssignedCardUser> AssignedUsers => _assignedUsers.AsReadOnly();
    
    private readonly List<Checklist> _checklists = [];
    public IReadOnlyCollection<Checklist> Checklists => _checklists.AsReadOnly();
    
    private readonly List<CardLabel> _labels = [];
    public IReadOnlyCollection<CardLabel> Labels => _labels.AsReadOnly();

    private Card() : base("") { }

    private Card(int cardListId, string cardName, string position) : base(position)
    {
        CardListId = cardListId;
        CardName = cardName;
    }

    private static Result ValidateCardName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 1 || name.Length > 256)
        {
            return new Error("InvalidCardName", ErrorType.BadRequest, "The Card name must contain between 1-256 characters!");
        }

        return Result.Success();
    }

    public static Result<Card> Create(int cardListId, string cardName, string? prevLocation)
    {
        Result validateCardNameResult = ValidateCardName(cardName);
        return validateCardNameResult.IsSuccess ? new Card(cardListId, cardName, 
            LexicalOrderHelper.GetBetween(prevLocation, null)) : validateCardNameResult.Error!;
    }

    public Result MoveCard(int cardListId, string? prevLocation, string? nextLocation)
    {
        Result moveResult = Move(prevLocation, nextLocation);
        if (!moveResult.IsSuccess) return moveResult;
        CardListId = cardListId;
        return Result.Success();
    }
    
    public Result RenameCard(string cardName)
    {
        Result validateCardNameResult = ValidateCardName(cardName);
        if (!validateCardNameResult.IsSuccess) return validateCardNameResult;
        
        CardName = cardName;
        return Result.Success();
    }

    public Result SetCardUrgency(CardUrgencyLevel cardUrgencyLevel)
    {
        CardUrgencyLevel = cardUrgencyLevel;
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
            if (checklistItem == null) continue;
            
            checklistItem.UpdateChecklistItemState(isDone);
            return checklistItem;
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
        if (label is null)
        {
            return new Error("NoLabelWithId", ErrorType.Conflict,
                "There is no label with the specified id on this card!");
        }
        return _labels.Remove(label) ? Result.Success() : Errors.Unknown;
    }

    public Result AssignUser(User user)
    {
        bool isDuplicate = _assignedUsers.Exists(asu => asu.UserId == user.UserId);
        if (isDuplicate)
            return new Error("AlreadyAssigned", ErrorType.Conflict,
                "This user has already been assigned to this card!");
        
        _assignedUsers.Add(new AssignedCardUser(CardId, user.UserId));
        return Result.Success();
    }

    public Result RemoveAssignedUser(Guid userId)
    {
        AssignedCardUser? assignedCardUser = _assignedUsers.FirstOrDefault(asu => asu.UserId == userId);
        if (assignedCardUser is null) return Errors.NotFound;
        
        bool succeeded = _assignedUsers.Remove(assignedCardUser);
        return succeeded ? Result.Success() : Errors.NotFound;
    }
}