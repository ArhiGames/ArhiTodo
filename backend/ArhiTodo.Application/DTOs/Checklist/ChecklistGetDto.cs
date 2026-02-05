using ArhiTodo.Application.DTOs.ChecklistItem;

namespace ArhiTodo.Application.DTOs.Checklist;

public class ChecklistGetDto
{
    public int ChecklistId { get; set; }
    
    public required string ChecklistName { get; set; }

    public List<ChecklistItemGetDto> ChecklistItems { get; set; } = [];
}