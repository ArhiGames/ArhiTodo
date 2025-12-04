using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Post;

public class ProjectPostDto
{
    [Required]
    [MinLength(1)] [MaxLength(30)]
    public required string ProjectName { get; set; }
}