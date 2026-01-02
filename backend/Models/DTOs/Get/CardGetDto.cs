using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class CardGetDto
{
    [Key]
    public int CardId { get; set; }
    
    public bool IsDone { get; set; } = false;
        
    [Required]
    [MinLength(1)] [MaxLength(35)]
    public required string CardName { get; set; }

    public List<CardLabelGetDto> Labels { get; set; } = new();
}