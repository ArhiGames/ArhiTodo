using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Post;

public class BoardPostDto
{
    [Required]
    [MinLength(1)] [MaxLength(35)]
    public required string BoardName { get; set; }
}