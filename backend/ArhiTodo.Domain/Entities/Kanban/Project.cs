namespace ArhiTodo.Domain.Entities.Kanban;

public class Project
{
    public int ProjectId { get; set; }
    
    public required string ProjectName { get; set; }

    public List<Board> Boards { get; set; } = new();
}    