namespace ArhiTodo.Application.DTOs.Label;

public class LabelGetDto
{
    public long LabelId { get; set; }

    public required int LabelColor { get; set; }

    public required string LabelText { get; set; }
}