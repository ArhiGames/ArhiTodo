using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class DetailedCardGetDto
{
    [Key]
    public int CardId { get; set; }
        
    [Required]
    [MinLength(1)] [MaxLength(90)]
    public required string CardName { get; set; }

    [MaxLength(8192)] 
    public string CardDescription { get; set; } = string.Empty;
    
    public List<CardLabelGetDto> Labels { get; set; } = new();
}