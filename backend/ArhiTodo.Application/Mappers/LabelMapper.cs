using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class LabelMapper
{
    public static LabelGetDto ToGetDto(this Label label)
    {
        return new LabelGetDto
        {
            LabelId = label.LabelId,
            LabelText = label.LabelText,
            LabelColor = label.LabelColor
        };
    }
}