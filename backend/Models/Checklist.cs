using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models;

public class Checklist
{
    [Key]
    public int ChecklistId { get; set; }
    
    [Required]
    [MinLength(1)] [MaxLength(90)]
    public required string ChecklistName { get; set; }

    public List<ChecklistItem> ChecklistItems { get; set; } = [];
    
    public int CardId { get; set; }
    public Card Card { get; set; } = null!;
}