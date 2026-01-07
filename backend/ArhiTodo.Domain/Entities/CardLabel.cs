namespace ArhiTodo.Domain.Entities;

public class CardLabel
{
    public required int CardId { get; set; }

    public Card Card { get; set; } = null!;

    
    public required int LabelId { get; set; }
    
    public Label Label { get; set; } = null!;
}