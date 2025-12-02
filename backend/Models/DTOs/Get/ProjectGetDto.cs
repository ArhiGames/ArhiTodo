using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class ProjectGetDto
{
    [Key]
    public int ProjectId { get; set; }
        
    [Required]
    [MinLength(1)] [MaxLength(30)]
    public required string ProjectName { get; set; }

    public List<BoardGetDto> Boards { get; set; } = new();
}