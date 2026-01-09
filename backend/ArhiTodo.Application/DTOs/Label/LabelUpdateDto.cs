namespace ArhiTodo.Application.DTOs.Label;

public class LabelUpdateDto
{
    public int LabelId { get; set; }

    public required int LabelColor { get; set; }

    public required string LabelText { get; set; }
}