using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs;

public class BoardPostDto
{
    [Required]
    [MinLength(1)] [MaxLength(50)]
    public required string BoardName { get; set; }
}