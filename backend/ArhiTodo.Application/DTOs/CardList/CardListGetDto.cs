using ArhiTodo.Application.DTOs.Card;

namespace ArhiTodo.Application.DTOs.CardList;

public class CardListGetDto
{
    public int CardListId { get; set; }
    
    public required string CardListName { get; set; }
    
    public List<CardGetDto> Cards { get; set; } = [];
}