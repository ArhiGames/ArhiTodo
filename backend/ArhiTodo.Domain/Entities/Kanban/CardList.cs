namespace ArhiTodo.Domain.Entities.Kanban;

public class CardList
{
    public int BoardId { get; private set; }
    
    public int CardListId { get; private set; }
    public string CardListName { get; private set; } = string.Empty;

    private readonly List<Card> _cards = [];
    public IReadOnlyCollection<Card> Cards => _cards.AsReadOnly();

    private CardList() { }

    public CardList(int boardId, string cardListName)
    {
        BoardId = boardId;
        CardListName = cardListName;
    }

    public void ChangeCardListName(string cardListName)
    {
        CardListName = cardListName;
    }
    
    public void AddCard(Card card)
    {
        _cards.Add(card);
    }

    public void ClearCards()
    {
        _cards.Clear();
    }
}    