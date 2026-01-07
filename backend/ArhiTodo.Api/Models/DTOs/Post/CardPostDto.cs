using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Post;

public class CardPostDto
{
    [Required]
    [MinLength(1)] [MaxLength(90)]
    public required string CardName { get; set; }
}