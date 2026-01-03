using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Post;

public class ChecklistItemPostDto
{
    [Required] 
    [MinLength(1)] [MaxLength(256)]
    public required string ChecklistItemName { get; set; }
}