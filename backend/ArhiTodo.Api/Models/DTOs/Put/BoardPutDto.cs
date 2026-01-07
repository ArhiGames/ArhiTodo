using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Put;

public class BoardPutDto
{
    [Required]
    public required int BoardId { get; set; }
    
    [Required]
    [MinLength(1)] [MaxLength(35)]
    public required string BoardName { get; set; }
}