using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Post;

namespace ArhiTodo.Mappers;

public static class CardListMapper
{
    public static CardList FromCardListPostDto(this CardListPostDto cardListPostDto)
    {
        return new CardList()
        {
            CardListName = cardListPostDto.CardListName
        };
    }
    
    public static CardListGetDto ToCardlistGetDto(this CardList cardList)
    {
        return new CardListGetDto()
        {
            CardListId = cardList.CardListId,
            CardListName = cardList.CardListName,
            Cards = cardList.Cards.Select(c => c.ToCardGetDto()).ToList()
        };
    }
}