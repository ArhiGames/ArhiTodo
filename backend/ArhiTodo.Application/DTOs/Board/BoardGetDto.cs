using ArhiTodo.Application.DTOs.CardList;

namespace ArhiTodo.Application.DTOs.Board;

public class BoardGetDto
{
    public int BoardId { get; set; }
        
    public required string BoardName { get; set; }
    
    public List<CardListGetDto> CardLists { get; set; } = new();
}