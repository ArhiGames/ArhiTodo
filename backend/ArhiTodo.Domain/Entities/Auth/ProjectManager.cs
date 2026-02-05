using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Entities.Auth;

public class ProjectManager
{
    public long ProjectId { get; private set; }
    public Project Project { get; } = null!;
    
    public Guid UserId { get; private set; }
    public User User { get; } = null!;

    private ProjectManager() { }
    
    public ProjectManager(long projectId, Guid userId)
    {
        ProjectId = projectId;
        UserId = userId;
    }
}