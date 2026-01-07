using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Get;

public class CardLabelGetDto
{
    [Required]
    public required int LabelId { get; set; }
}