using ArhiTodo.Domain.Exceptions;

namespace ArhiTodo.Domain.Entities.Kanban;

public class CardList
{
    public int CardListId { get; private set; }

    public string CardListName { get; private set; } = string.Empty;

    private readonly List<int> _cardIds = new();
    public IReadOnlyCollection<int> CardIds => _cardIds.AsReadOnly();

    private CardList() { }

    public CardList(string cardListName)
    {
        CardListName = cardListName;
    }
    
    public void AddCard(int cardId)
    {
        if (_cardIds.Contains(cardId))
        {
            throw new CardAlreadyExistsException();
        }
        _cardIds.Add(cardId);
    }
}    