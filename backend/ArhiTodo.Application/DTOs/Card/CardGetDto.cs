namespace ArhiTodo.Application.DTOs.Card;

public class CardGetDto
{
    public int CardId { get; set; }
    
    public bool IsDone { get; set; }
    
    public required string CardName { get; set; }

    public string CardDescription { get; set; } = string.Empty;
    
    // @Todo
    // public List<CardLabel> CardLabels { get; set; } = [];
    // public List<Checklist> Checklists { get; set; } = [];
}