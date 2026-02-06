namespace ArhiTodo.Domain.Entities.Kanban;

public class CardLabel
{
    public int LabelId { get; private set; }
    public Label Label { get; } = null!;
    
    public int CardId { get; private set; }
    public Card Card { get; } = null!;

    private CardLabel() { }
    
    public CardLabel(int labelId, int cardId)
    {
        LabelId = labelId;
        CardId = cardId;
    }
}