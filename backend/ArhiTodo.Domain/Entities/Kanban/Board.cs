using ArhiTodo.Domain.Common;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Board : AggregateRoot<int>
{
    public int ProjectId { get; private set; }
    public string BoardName { get; private set; } = string.Empty;
    
    public Guid OwnedByUserId { get; private set; }

    private readonly List<CardList> _cardLists = new();
    public IReadOnlyCollection<CardList> CardLists => _cardLists.AsReadOnly();

    private readonly List<Label> _labels = new();
    public IReadOnlyCollection<Label> Labels => _labels.AsReadOnly();
    
    public List<BoardUserClaim> BoardUserClaims { get; set; } = new();
    
    private Board() {  }

    public Board(int projectId, string name, Guid createdByUserId)
    {
        ProjectId = projectId;
        BoardName = name;
        OwnedByUserId = createdByUserId;
    }

    public void AddCardList(string cardListName)
    {
        CardList cardList = new(cardListName);
        _cardLists.Add(cardList);
    }

    public void AddLabel(string labelText, int labelColor)
    {
        Label label = new(labelText, labelColor);
        _labels.Add(label);
    }
}