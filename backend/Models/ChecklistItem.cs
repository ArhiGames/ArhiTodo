using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models;

public class ChecklistItem
{
    [Key]
    public int ChecklistItemId { get; set; }

    [Required] 
    [MinLength(1)] [MaxLength(256)]
    public required string ChecklistItemName { get; set; }
    
    public bool IsDone { get; set; }
    
    public int ChecklistId { get; set; }
    public Checklist Checklist { get; set; } = null!;
}