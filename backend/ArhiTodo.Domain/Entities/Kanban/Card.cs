namespace ArhiTodo.Domain.Entities.Kanban;

public class Card
{
    public long CardListId { get; private set; }
    
    public long CardId { get; init; }
    public string CardName { get; private set; } = string.Empty;
    public string CardDescription { get; private set; } = string.Empty;
    public bool IsDone { get; private set; }
    
    private readonly List<Checklist> _checklists = [];
    public IReadOnlyCollection<Checklist> Checklists => _checklists.AsReadOnly();
    
    private readonly List<Label> _labels = [];
    public IReadOnlyCollection<Label> Labels => _labels.AsReadOnly();

    private Card() { }

    public Card(string cardName)
    {
        CardName = cardName;
    }

    public void AddChecklist(Checklist checklist)
    {
        _checklists.Add(checklist);
    }

    public void AddLabel(Label label)
    {
        _labels.Add(label);
    }
}