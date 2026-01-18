using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class CardListMapper
{
    public static CardList FromCreateDto(this CardListCreateDto cardListCreateDto, int boardId)
    {
        return new CardList
        {
            BoardId = boardId,
            CardListName = cardListCreateDto.CardListName
        };
    }

    public static CardList FromUpdateDto(this CardListUpdateDto cardListUpdateDto, int boardId)
    {
        return new CardList
        {
            CardListId = cardListUpdateDto.CardListId,
            CardListName = cardListUpdateDto.CardListName,
            BoardId = boardId
        };
    }

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