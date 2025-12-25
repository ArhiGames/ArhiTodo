using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class LabelGetDto
{
    [Key]
    public int LabelId { get; set; }

    [Required] 
    public required int LabelColor { get; set; }

    [Required] 
    [MinLength(1), MaxLength(25)]
    public required string LabelText { get; set; }
}