using ArhiTodo.Application.DTOs.Board;

namespace ArhiTodo.Application.DTOs.Project;

public class ProjectGetDto
{
    public int ProjectId { get; init; }
    
    public required string ProjectName { get; set; }
    
    public required Guid OwnedByUserId { get; set; }
    
    public List<BoardGetDto> Boards { get; set; } = [];
}