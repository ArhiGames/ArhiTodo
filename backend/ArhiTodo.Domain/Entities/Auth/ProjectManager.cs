using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Entities.Auth;

public class ProjectManager
{
    public required int ProjectId { get; set; }
    
    public Project Project { get; set; } = null!;
    
    public required Guid UserId { get; set; }
    
    public User User { get; set; } = null!;
}