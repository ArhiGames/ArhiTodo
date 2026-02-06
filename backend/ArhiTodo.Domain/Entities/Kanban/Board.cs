using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Exceptions;

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

    public void AddUserClaim(BoardClaims boardClaim, string value, Guid userId)
    {
        BoardUserClaim boardUserClaim = new(boardClaim, value, BoardId, userId);
        _boardUserClaims.Add(boardUserClaim);
    }
    
    public void UpdateUserClaim(BoardClaims boardClaims, string newValue)
    {
        BoardUserClaim? boardUserClaim = _boardUserClaims.Find(bc => bc.Type == boardClaims.ToString());
        boardUserClaim?.UpdateValue(newValue);
    }

    public void AddMember(Guid userId)
    {
        BoardUserClaim boardUserClaim = new(BoardClaims.ViewBoard, "true", BoardId, userId);
        _boardUserClaims.Add(boardUserClaim);
    }

    public bool RemoveMember(Guid userId)
    {
        BoardUserClaim? foundBoardUserClaim = _boardUserClaims.FirstOrDefault(bc => bc.UserId == userId
            && bc.Type == nameof(BoardClaims.ViewBoard));
        return foundBoardUserClaim != null && _boardUserClaims.Remove(foundBoardUserClaim);
    }

    public void AddCardlist(CardList cardList)
    {
        _cardLists.Add(cardList);
    }

    public bool RemoveCardlist(int cardListId)
    {
        CardList? cardList = _cardLists.FirstOrDefault(cl => cl.CardListId == cardListId);
        return cardList != null && _cardLists.Remove(cardList);
    }
    
    public Label AddLabel(string labelText, int labelColor)
    {
        Label label = new(BoardId, labelText, labelColor);
        _labels.Add(label);
        return label;
    }

    public bool RemoveLabel(int labelId)
    {
        Label? label = _labels.FirstOrDefault(l => l.LabelId == labelId);
        if (label == null)
        {
            throw new NothingToDeleteException("There is no label to delete with the specified id on this board");
        }
        return _labels.Remove(label);
    }
}