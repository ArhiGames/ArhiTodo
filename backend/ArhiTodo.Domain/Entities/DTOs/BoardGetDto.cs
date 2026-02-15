namespace ArhiTodo.Domain.Entities.DTOs;

public class BoardGetDto
{
    public int BoardId { get; set; }
    
    public required float Position { get; set; }
        
    public required string BoardName { get; set; }

    public required Guid OwnedByUserId { get; set; }
    
    public List<CardListGetDto> CardLists { get; set; } = [];
    public List<LabelGetDto> Labels { get; set; } = [];
}