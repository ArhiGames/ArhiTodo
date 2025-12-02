using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;

namespace ArhiTodo.Mappers;

public static class CardListMapper
{
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