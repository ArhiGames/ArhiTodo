using ArhiTodo.Domain.Exceptions;

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
    
    private readonly List<CardLabel> _labels = [];
    public IReadOnlyCollection<CardLabel> Labels => _labels.AsReadOnly();

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

    public bool RemoveChecklist(int checklistId)
    {
        Checklist? checklist = _checklists.FirstOrDefault(cl => cl.ChecklistId == checklistId);
        if (checklist == null)
        {
            throw new NothingToDeleteException("There is no checklist with specified id on this card!");
        }
        return _checklists.Remove(checklist);
    }

    public ChecklistItem? UpdateChecklistItemState(int checklistItemId, bool isDone)
    {
        foreach (Checklist checklist in _checklists)
        {
            ChecklistItem? checklistItem =
                checklist.ChecklistItems.FirstOrDefault(ci => ci.ChecklistItemId == checklistItemId);
            if (checklistItem != null)
            {
                checklistItem.UpdateChecklistItemState(isDone);
                return checklistItem;
            }
        }
        return null;
    }

    public void AddLabel(Label label)
    {
        _labels.Add(new CardLabel(label.LabelId, CardId));
    }

    public bool RemoveLabel(int labelId)
    {
        CardLabel? label = _labels.FirstOrDefault(l => l.LabelId == labelId);
        if (label == null)
        {
            throw new NothingToDeleteException("There is no label with the specified id on this card!");
        }
        return _labels.Remove(label);
    }
}