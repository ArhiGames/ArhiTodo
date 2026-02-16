namespace ArhiTodo.Domain.Entities.DTOs;

public class CardGetDto
{
    public int CardId { get; set; }
    
    public required string Position { get; set; }
    
    public bool IsDone { get; set; }
    
    public required string CardName { get; set; }

    public string CardDescription { get; set; } = string.Empty;
    
    public List<int> LabelIds { get; set; } = [];
    public List<ChecklistGetDto> Checklists { get; set; } = [];
}