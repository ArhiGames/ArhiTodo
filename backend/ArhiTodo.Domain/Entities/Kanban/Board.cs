using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Helpers;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Board : Draggable
{
    public int ProjectId { get; private set; }
    public Project Project { get; } = null!;
    
    public int BoardId { get; init; }
    public string BoardName { get; private set; } = string.Empty;
    
    public Guid OwnerId { get; private set; }
    public User Owner { get; } = null!;

    private readonly List<CardList> _cardLists = [];
    public IReadOnlyCollection<CardList> CardLists => _cardLists.AsReadOnly();

    private readonly List<Label> _labels = [];
    public IReadOnlyCollection<Label> Labels => _labels.AsReadOnly();

    private readonly List<BoardUserClaim> _boardUserClaims = [];
    public IReadOnlyCollection<BoardUserClaim> BoardUserClaims => _boardUserClaims.AsReadOnly();
    
    private Board() : base("") {  }

    private Board(int projectId, string name, Guid createdByUserId, string prevPosition) : base(prevPosition)
    {
        ProjectId = projectId;
        BoardName = name;
        OwnerId = createdByUserId;
    }

    private static Result ValidateBoardName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 1 || name.Length > 32)
        {
            return new Error("InvalidBoardName", ErrorType.BadRequest, "The board name must contain between 1-32 characters!");
        }

        return Result.Success();
    }

    public static Result<Board> Create(int projectId, string name, Guid createdByUserId, string? prevPosition)
    {
        Result validateBoardNameResult = ValidateBoardName(name);
        if (!validateBoardNameResult.IsSuccess) return validateBoardNameResult.Error!;
        
        Board board = new(projectId, name, createdByUserId, LexicalOrderHelper.GetBetween(prevPosition, null));
        board.InitializeCreatorPermissions(createdByUserId);
        return board;

    }

    public Result ChangeName(string boardName)
    {
        Result validateBoardNameResult = ValidateBoardName(boardName);
        if (!validateBoardNameResult.IsSuccess) return validateBoardNameResult;
        
        BoardName = boardName;
        return Result.Success();
    }

    private void InitializeCreatorPermissions(Guid userId)
    {
        AddMember(userId);
        foreach (BoardClaimTypes boardClaim in Enum.GetValuesAsUnderlyingType<BoardClaimTypes>())
        {
            if (boardClaim == BoardClaimTypes.ViewBoard) continue; // Handled by the AddMember method
            AddOrUpdateUserClaim(boardClaim, true, userId);
        }
    }
    
    public Result AddOrUpdateUserClaim(BoardClaimTypes boardClaimType, bool newValue, Guid userId)
    {
        if (OwnerId == userId)
        {
            return new Error("UpdatingOwnerClaims", ErrorType.Conflict,
                "Cannot update the board user claims of the owner from the board!");
        }

        if (boardClaimType == BoardClaimTypes.ViewBoard)
        {
            return new Error("WrongMethodCalled", ErrorType.Conflict,
                "Cannot change the view board claim using this method! Use the AddMember Method directly!");
        }
        
        BoardUserClaim? foundBoardUserClaim = _boardUserClaims.Find(bc => bc.UserId == userId && bc.Type == boardClaimType);
        if (foundBoardUserClaim is null)
        {
            BoardUserClaim boardUserClaim = new(boardClaimType, newValue, BoardId, userId);
            _boardUserClaims.Add(boardUserClaim);
        }
        else
        {
            foundBoardUserClaim.UpdateValue(newValue);
        }

        return Result.Success();
    }

    public Result AddMember(Guid userId)
    {
        if (IsMember(userId))
        {
            return new Error("AlreadyMember", ErrorType.Conflict,
                "The user with the specified id is already a member of the board!");
        }
        BoardUserClaim boardUserClaim = new(BoardClaimTypes.ViewBoard, true, BoardId, userId);
        _boardUserClaims.Add(boardUserClaim);
        return Result.Success();
    }

    public Result RemoveMember(Guid userId)
    {
        if (OwnerId == userId)
        {
            return new Error("TryingToDeleteOwner", ErrorType.Conflict,
                "Cannot remove the owner of the board from the board member list!");
        }
        
        int removedClaims = _boardUserClaims.RemoveAll(bc => bc.UserId == userId);
        return removedClaims > 0 ? Result.Success() : Errors.Unknown;
    }

    private bool IsMember(Guid userId)
    {
        return _boardUserClaims.Any(buc =>
            buc.UserId == userId && buc is { Type: BoardClaimTypes.ViewBoard, Value: true });
    } 

    public List<Guid> GetMemberIds()
    {
        return _boardUserClaims.Where(buc => buc is { Type: BoardClaimTypes.ViewBoard, Value: true })
            .Select(buc => buc.UserId).ToList();
    }

    public void AddCardlist(CardList cardList)
    {
        _cardLists.Add(cardList);
    }

    public Result RemoveCardlist(int cardListId)
    {
        CardList? cardList = _cardLists.FirstOrDefault(cl => cl.CardListId == cardListId);
        if (cardList == null)
        {
            return new Error("NoCardListWithId", ErrorType.Conflict,
                "There is no cardlist with the specified id on this board!");
        } 
        return _cardLists.Remove(cardList) ? Result.Success() : Errors.Unknown;
    }
    
    public Result<Label> AddLabel(string labelText, int labelColor, string? prevPosition)
    {
        Result<Label> createLabelResult = Label.Create(BoardId, labelText, labelColor, prevPosition);
        if (!createLabelResult.IsSuccess) return createLabelResult;
        
        _labels.Add(createLabelResult.Value!);
        return createLabelResult.Value!;
    }

    public Result DeleteLabel(int labelId)
    {
        Label? label = _labels.FirstOrDefault(l => l.LabelId == labelId);
        if (label == null)
        {
            return new Error("NoLabelToDelete", ErrorType.Conflict,
                "There is no label with the specified id on this board!");
        }
        return _labels.Remove(label) ? Result.Success() : Errors.Unknown;
    }
}