namespace ArhiTodo.Domain.Entities.DTOs;

public class ChecklistItemGetDto
{
    public int ChecklistItemId { get; set; }

    public required string ChecklistItemName { get; set; }
    
    public bool IsDone { get; set; }
}