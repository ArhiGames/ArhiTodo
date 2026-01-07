using ArhiTodo.Domain.Entities;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;

namespace ArhiTodo.Mappers;

public static class LabelMapper
{
    public static LabelGetDto ToLabelGetDto(this Label label)
    {
        return new LabelGetDto()
        {
            LabelId = label.LabelId,
            LabelText = label.LabelText,
            LabelColor = label.LabelColor
        };
    }
    
    public static CardLabelGetDto ToCardLabelGetDto(this CardLabel cardLabel)
    {
        return new CardLabelGetDto()
        {
            LabelId = cardLabel.LabelId
        };
    }
}