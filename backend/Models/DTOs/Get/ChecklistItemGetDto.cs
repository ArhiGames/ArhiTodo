using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class ChecklistItemGetDto
{
    [Key]
    public int ChecklistItemId { get; set; }

    [Required] 
    [MinLength(1)] [MaxLength(256)]
    public required string ChecklistItemName { get; set; }
    
    public bool IsDone { get; set; }
}