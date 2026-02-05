using ArhiTodo.Application.DTOs.Checklist;

namespace ArhiTodo.Application.DTOs.Card;

public class CardGetDto
{
    public long CardId { get; set; }
    
    public bool IsDone { get; set; }
    
    public required string CardName { get; set; }

    public string CardDescription { get; set; } = string.Empty;
    
    public List<long> LabelIds { get; set; } = [];
    public List<ChecklistGetDto> Checklists { get; set; } = [];
}