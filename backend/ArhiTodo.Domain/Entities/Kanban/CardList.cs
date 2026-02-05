namespace ArhiTodo.Domain.Entities.Kanban;

public class CardList
{
    public long BoardId { get; private set; }
    
    public long CardListId { get; private set; }
    public string CardListName { get; private set; } = string.Empty;

    private readonly List<Card> _cards = new();
    public IReadOnlyCollection<Card> Cards => _cards.AsReadOnly();

    private CardList() { }

    public CardList(string cardListName)
    {
        CardListName = cardListName;
    }
    
    public void AddCard(Card card)
    {
        _cards.Add(card);
    }
}    