using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class CardListMapper
{
    public static CardListGetDto ToGetDto(this CardList cardList)
    {
        return new CardListGetDto
        {
            CardListId = cardList.CardListId,
            CardListName = cardList.CardListName,
            Cards = cardList.Cards.Select(c => c.ToGetDto()).ToList()
        };
    }
}