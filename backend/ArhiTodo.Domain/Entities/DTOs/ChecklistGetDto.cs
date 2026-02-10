namespace ArhiTodo.Domain.Entities.DTOs;

public class ChecklistGetDto
{
    public int ChecklistId { get; set; }
    
    public required string ChecklistName { get; set; }

    public List<ChecklistItemGetDto> ChecklistItems { get; set; } = [];
}