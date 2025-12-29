using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class DetailedCardGetDto
{
    [Key]
    public int CardId { get; set; }
        
    [Required]
    [MinLength(1)] [MaxLength(90)]
    public required string CardName { get; set; }

    public List<CardLabelGetDto> Labels { get; set; } = new();
}