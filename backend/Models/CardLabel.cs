using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models;

public class CardLabel
{
    [Required]
    public required int CardId { get; set; }

    public Card Card { get; set; } = null!;

    [Required]
    public required int LabelId { get; set; }

    public Label Label { get; set; } = null!;
}