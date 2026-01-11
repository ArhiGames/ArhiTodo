namespace ArhiTodo.Domain.Entities.Kanban;

public class Card
{
    public int CardId { get; set; }
    
    public bool IsDone { get; set; }
    
    public required string CardName { get; set; }

    public string CardDescription { get; set; } = string.Empty;
    
    public List<CardLabel> CardLabels { get; set; } = [];
    public List<Checklist> Checklists { get; set; } = [];
    
    
    public int CardListId { get; set; }
    public CardList CardList { get; set; } = null!;
}