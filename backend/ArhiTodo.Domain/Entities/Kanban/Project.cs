using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Project
{
    public int ProjectId { get; set; }
    
    public required string ProjectName { get; set; }
    
    public required Guid OwnedByUserId { get; set; }
    public User Owner { get; set; } = null!;

    public List<ProjectManager> ProjectManagers { get; set; } = new();
    public List<Board> Boards { get; set; } = new();
}    