using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs;

public class CardListPostDto
{
    [Required]
    [MinLength(3)] [MaxLength(35)]
    public required string CardName { get; set; }
}