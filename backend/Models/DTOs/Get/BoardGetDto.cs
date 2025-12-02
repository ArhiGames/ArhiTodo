using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class BoardGetDto
{
    [Key]
    public int BoardId { get; set; }
        
    [Required]
    [MinLength(1)] [MaxLength(50)]
    public required string BoardName { get; set; }
        
    public List<CardListGetDto> CardLists { get; set; } = new();
}