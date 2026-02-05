namespace ArhiTodo.Domain.Entities.Kanban;

public class Label
{
    public long BoardId { get; private set; }
    
    public long LabelId { get; private set; }
    public int LabelColor { get; private set; }
    public string LabelText { get; private set; } = string.Empty;

    private Label() { }

    public Label(string labelText, int labelColor)
    {
        LabelText = labelText;
        LabelColor = labelColor;
    }
}