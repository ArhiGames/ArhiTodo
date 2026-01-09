namespace ArhiTodo.Application.DTOs.Board;

public class BoardGetDto
{
    public int BoardId { get; set; }
        
    public required string BoardName { get; set; }
    
    // @Todo
    // public List<CardListGetDto> CardLists { get; set; } = new();
}