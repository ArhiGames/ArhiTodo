using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Application.Mappers;

public static class LabelMapper
{
    public static Label FromCreateDto(this LabelCreateDto labelCreateDto, int boardId)
    {
        return new Label
        {
            BoardId = boardId,
            LabelText = labelCreateDto.LabelText,
            LabelColor = labelCreateDto.LabelColor
        };
    }

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