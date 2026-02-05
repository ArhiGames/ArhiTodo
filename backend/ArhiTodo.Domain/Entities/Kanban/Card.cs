namespace ArhiTodo.Domain.Entities.Kanban;

public class Card
{
    public int CardListId { get; private set; }
    
    public int CardId { get; init; }
    public string CardName { get; private set; } = string.Empty;
    public string CardDescription { get; private set; } = string.Empty;
    public bool IsDone { get; private set; }
    
    private readonly List<Checklist> _checklists = [];
    public IReadOnlyCollection<Checklist> Checklists => _checklists.AsReadOnly();
    
    private readonly List<Label> _labels = [];
    public IReadOnlyCollection<Label> Labels => _labels.AsReadOnly();

    private Card() { }

    public Card(int cardListId, string cardName)
    {
        CardListId = cardListId;
        CardName = cardName;
    }

    public void RenameCard(string cardName)
    {
        CardName = cardName;
    }

    public void ChangeCardDescription(string cardDescription)
    {
        CardDescription = cardDescription;
    }

    public void UpdateCardState(bool isDone)
    {
        IsDone = isDone;
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