namespace ArhiTodo.Domain.Entities.DTOs;

public class LabelGetDto
{
    public int LabelId { get; set; }

    public required int LabelColor { get; set; }

    public required string LabelText { get; set; }
}