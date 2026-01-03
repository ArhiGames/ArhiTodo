using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Post;

public class ChecklistPostDto
{
    [Required] 
    [MinLength(1)] [MaxLength(90)]
    public required string ChecklistName { get; set; }
}