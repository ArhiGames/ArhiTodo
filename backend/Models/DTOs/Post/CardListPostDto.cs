using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Post;

public class CardListPostDto
{
    [Required]
    [MinLength(1)] [MaxLength(35)]
    public required string CardListName { get; set; }
}