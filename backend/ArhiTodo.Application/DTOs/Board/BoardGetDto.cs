using ArhiTodo.Application.DTOs.CardList;

namespace ArhiTodo.Application.DTOs.Board;

public class BoardGetDto
{
    public long BoardId { get; set; }
        
    public required string BoardName { get; set; }

    public required Guid OwnedByUserId { get; set; }
    
    public List<CardListGetDto> CardLists { get; set; } = new();
}