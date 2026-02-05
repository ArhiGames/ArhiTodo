namespace ArhiTodo.Domain.Entities.Kanban;

public class Label
{
    public int BoardId { get; private set; }
    
    public int LabelId { get; private set; }
    public int LabelColor { get; private set; }
    public string LabelText { get; private set; } = string.Empty;

    private Label() { }

    public Label(int boardId, string labelText, int labelColor)
    {
        BoardId = boardId;
        LabelText = labelText;
        LabelColor = labelColor;
    }
}