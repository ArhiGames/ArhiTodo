using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Board
{
    public int ProjectId { get; private set; }
    
    public int BoardId { get; init; }
    public string BoardName { get; private set; } = string.Empty;
    
    public Guid OwnedByUserId { get; private set; }
    public User Owner { get; } = null!;

    private readonly List<CardList> _cardLists = [];
    public IReadOnlyCollection<CardList> CardLists => _cardLists.AsReadOnly();

    private readonly List<Label> _labels = [];
    public IReadOnlyCollection<Label> Labels => _labels.AsReadOnly();

    private readonly List<BoardUserClaim> _boardUserClaims = [];
    public IReadOnlyCollection<BoardUserClaim> BoardUserClaims => _boardUserClaims.AsReadOnly();
    
    private Board() {  }

    public Board(int projectId, string name, Guid createdByUserId)
    {
        ProjectId = projectId;
        BoardName = name;
        OwnedByUserId = createdByUserId;
    }

    public void ChangeName(string boardName)
    {
        BoardName = boardName;
    }

    public void AddUserClaim(BoardClaimTypes boardClaimType, string value, Guid userId)
    {
        BoardUserClaim boardUserClaim = new(boardClaimType, value, BoardId, userId);
        _boardUserClaims.Add(boardUserClaim);
    }
    
    public void UpdateUserClaim(BoardClaimTypes boardClaimType, string newValue)
    {
        BoardUserClaim? boardUserClaim = _boardUserClaims.Find(bc => bc.Type == boardClaimType);
        boardUserClaim?.UpdateValue(newValue);
    }

    public void AddMember(Guid userId)
    {
        BoardUserClaim boardUserClaim = new(BoardClaimTypes.ViewBoard, "true", BoardId, userId);
        _boardUserClaims.Add(boardUserClaim);
    }

    public bool RemoveMember(Guid userId)
    {
        BoardUserClaim? foundBoardUserClaim = _boardUserClaims.FirstOrDefault(bc => bc.UserId == userId
            && bc.Type == BoardClaimTypes.ViewBoard);
        return foundBoardUserClaim != null && _boardUserClaims.Remove(foundBoardUserClaim);
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
        Label label = new(BoardId, labelText, labelColor);
        _labels.Add(label);
        return label;
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