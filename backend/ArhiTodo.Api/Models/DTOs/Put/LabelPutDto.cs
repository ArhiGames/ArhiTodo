using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Put;

public class LabelPutDto
{
    [Required]
    public required int LabelId { get; set; }

    public string LabelText { get; set; } = string.Empty;
    
    // -1 if the color should not be changed
    public int LabelColor { get; set; } = -1;
}