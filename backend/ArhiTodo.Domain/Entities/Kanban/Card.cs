using ArhiTodo.Domain.Common;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Card : AggregateRoot<int>
{
    public bool IsDone { get; private set; }
    public string CardName { get; private set; } = string.Empty;
    public string CardDescription { get; private set; } = string.Empty;
    
    public List<Checklist> Checklists { get; set; } = [];

    private readonly List<int> _labelIds = new();
    public IReadOnlyCollection<int> LabelIds => _labelIds.AsReadOnly();

    private Card() { }

    public Card(string cardName)
    {
        CardName = cardName;
    }
}