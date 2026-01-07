using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class ChecklistGetDto
{
    [Key]
    public int ChecklistId { get; set; }
    
    [Required]
    [MinLength(1)] [MaxLength(90)]
    public required string ChecklistName { get; set; }

    public List<ChecklistItemGetDto> ChecklistItems { get; set; } = [];
}