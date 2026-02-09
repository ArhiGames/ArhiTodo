using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Project
{
    public int ProjectId { get; init; }
    
    public string ProjectName { get; private set; } = string.Empty;

    private readonly List<Board> _boards = [];
    public IReadOnlyCollection<Board> Boards => _boards.AsReadOnly();

    public Guid OwnerId { get; }
    public User Owner { get; } = null!;

    private readonly List<ProjectManager> _projectManagers = [];
    public IReadOnlyCollection<ProjectManager> ProjectManagers => _projectManagers.AsReadOnly();
    
    private Project() {  }

    private Project(string name, User user)
    {
        ProjectName = name;
        OwnerId = user.UserId;
        Owner = user;
    }

    private static Result ValidateProjectName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 1 || name.Length > 32)
        {
            return new Error("InvalidProjectName", ErrorType.BadRequest, "The project name must contain between 1-32 characters!");
        }

        return Result.Success();
    }
    
    public static Result<Project> Create(string name, User user)
    {
        Result checkProjectNameResult = ValidateProjectName(name);
        return checkProjectNameResult.IsSuccess ? new Project(name, user) : checkProjectNameResult.Error!;
    }

    public Result ChangeName(string projectName)
    {
        Result checkProjectNameResult = ValidateProjectName(projectName);
        if (!checkProjectNameResult.IsSuccess) return checkProjectNameResult;
        
        ProjectName = projectName;
        return Result.Success();
    }

    public Result AddProjectManager(ProjectManager user)
    {
        if (_projectManagers.Exists(pm => pm.UserId == user.UserId))
        {
            return new Error("AlreadyExistingProjectManager", ErrorType.Conflict,
                "The user with the specified id is already a project manager");
        }
        _projectManagers.Add(user);
        return Result.Success();
    }

    public Result RemoveProjectManager(Guid projectManagerId)
    {
        ProjectManager? projectManager = _projectManagers.FirstOrDefault(pm => pm.UserId == projectManagerId);
        if (projectManager is null)
        {
            return new Error("NoProjectManagerWithId", ErrorType.Conflict,
                "There is no user (project manager) with the specified id on this project!");
        }

        if (OwnerId == projectManagerId)
        {
            return new Error("TryingToDeleteOwner", ErrorType.Conflict,
                "Cannot remove the owner of the project from the project manager list!");
        }
        
        return _projectManagers.Remove(projectManager) ? Result.Success() : Errors.Unknown;
    }

    public bool IsProjectMember(Guid userId)
    {
        return OwnerId == userId || _projectManagers.Any(pm => pm.UserId == userId);
    }

    public Result AddBoard(Board board)
    {
        _boards.Add(board);
        return Result.Success();
    }

    public Result RemoveBoard(int boardId)
    {
        Board? boardToRemove = _boards.FirstOrDefault(b => b.BoardId == boardId);
        if (boardToRemove is null)
        {
            return new Error("RemoveBoard", ErrorType.Conflict, "There is no board with the specified id to remove!");
        }

        return _boards.Remove(boardToRemove) ? Result.Success() : Errors.Unknown;
    }
}    