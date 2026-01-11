namespace ArhiTodo.Domain.Entities.Kanban;

public class Label
{
    public int LabelId { get; set; }

    public required int LabelColor { get; set; }

    public required string LabelText { get; set; }
    
    public int BoardId { get; set; }
    public Board Board { get; set; } = null!;
}