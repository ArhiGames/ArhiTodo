namespace ArhiTodo.Domain.Entities.DTOs;

public class CardListGetDto
{
    public int CardListId { get; set; }
    
    public required float Position { get; set; }
    
    public required string CardListName { get; set; }
    
    public List<CardGetDto> Cards { get; set; } = [];
}