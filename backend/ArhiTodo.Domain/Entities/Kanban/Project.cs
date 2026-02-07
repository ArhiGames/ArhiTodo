using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Project
{
    public int ProjectId { get; init; }
    
    public string ProjectName { get; private set; } = string.Empty;

    private readonly List<Board> _boards = [];
    public IReadOnlyCollection<Board> Boards => _boards.AsReadOnly();

    public Guid OwnedByUserId { get; }
    public User Owner { get; } = null!;

    private readonly List<ProjectManager> _projectManagers = [];
    public IReadOnlyCollection<ProjectManager> ProjectManagers => _projectManagers.AsReadOnly();
    
    private Project() {  }

    public Project(string name, User user)
    {
        ProjectName = name;
        OwnedByUserId = user.UserId;
    }

    public void ChangeName(string projectName)
    {
        ProjectName = projectName;
    }

    public void AddProjectManager(ProjectManager user)
    {
        if (_projectManagers.Exists(pm => pm.UserId == user.UserId))
        {
            throw new AlreadyExistsException("Project manager with id already exists!");
        }

        _projectManagers.Add(user);
    }

    public bool RemoveProjectManager(Guid projectManagerId)
    {
        ProjectManager? projectManager = _projectManagers.FirstOrDefault(pm => pm.UserId == projectManagerId);
        if (projectManager == null)
        {
            throw new NothingToDeleteException("The project manager cannot be deleted, because it wasn't found");
        }
        return _projectManagers.Remove(projectManager);
    }

    public void AddBoard(Board board, Guid userId)
    {
        if (!_projectManagers.Exists(pm => pm.UserId == userId) && userId != OwnedByUserId)
        {
            throw new BoardPermissionException("The user is neither a project manager nor the project owner!");
        }
        
        _boards.Add(board);
    }
}    