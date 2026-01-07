using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Post;

public class LabelPostDto
{
    [Required] 
    public required string LabelText { get; set; }
    
    [Required] 
    public required int LabelColor { get; set; }
}