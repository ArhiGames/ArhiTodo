using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Post;

namespace ArhiTodo.Mappers;

public static class CardMapper
{
    public static Card FromCardPostDto(this CardPostDto cardPostDto)
    {
        return new Card()
        {
            CardName = cardPostDto.CardName
        };
    }
    
    public static CardGetDto ToCardGetDto(this Card card)
    {
        return new CardGetDto()
        {
            CardId = card.CardId,
            CardName = card.CardName
        };
    }
}