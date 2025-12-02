using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;

namespace ArhiTodo.Mappers;

public static class CardMapper
{
    public static CardGetDto ToCardGetDto(this Card card)
    {
        return new CardGetDto()
        {
            CardId = card.CardId,
            CardName = card.CardName
        };
    }
}