using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Board
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
    
    private Board() {  }

    private Board(int projectId, string name, Guid createdByUserId)
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

    public static Result<Board> Create(int projectId, string name, Guid createdByUserId)
    {
        Result validateBoardNameResult = ValidateBoardName(name);
        if (!validateBoardNameResult.IsSuccess) return validateBoardNameResult.Error!;
        
        Board board = new(projectId, name, createdByUserId);
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
            AddOrUpdateUserClaim(boardClaim, "true", userId);
        }
    }
    
    public void AddOrUpdateUserClaim(BoardClaimTypes boardClaimType, string newValue, Guid userId)
    {
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
    }

    public bool HasClaim(BoardClaimTypes boardClaimType, string value, Guid userId)
    {
        return _boardUserClaims.Any(buc => buc.Type == boardClaimType && buc.Value == value && buc.UserId == userId);
    }

    public Result AddMember(Guid userId)
    {
        if (IsMember(userId))
        {
            return new Error("AlreadyMember", ErrorType.Conflict,
                "The user with the specified id is already a member of the board!");
        }
        BoardUserClaim boardUserClaim = new(BoardClaimTypes.ViewBoard, "true", BoardId, userId);
        _boardUserClaims.Add(boardUserClaim);
        return Result.Success();
    }

    public bool RemoveMember(Guid userId)
    {
        int removedClaims = _boardUserClaims.RemoveAll(bc => bc.UserId == userId);
        return removedClaims > 0;
    }

    private bool IsMember(Guid userId)
    {
        return _boardUserClaims.Any(buc =>
            buc.UserId == userId && buc.Type == BoardClaimTypes.ViewBoard && buc.Value == "true");
    } 

    public List<Guid> GetMemberIds()
    {
        return _boardUserClaims.Where(buc => buc.Type == BoardClaimTypes.ViewBoard && buc.Value == "true")
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
    
    public Result<Label> AddLabel(string labelText, int labelColor)
    {
        Result<Label> createLabelResult = Label.Create(BoardId, labelText, labelColor);
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