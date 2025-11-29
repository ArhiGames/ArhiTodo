using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class CardListGetDto
{
    [Key]
    public int CardListId { get; set; }
        
    [Required]
    [MinLength(1)] [MaxLength(35)]
    public required string CardListName { get; set; }

    public List<CardGetDto> Cards { get; set; } = null!;
}