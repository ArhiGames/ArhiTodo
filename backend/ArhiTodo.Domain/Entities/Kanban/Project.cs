using ArhiTodo.Domain.Common;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Exceptions;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Project : AggregateRoot<int>
{
    public string ProjectName { get; private set; } = string.Empty;

    private readonly List<int> _boardIds = new();
    public IReadOnlyCollection<int> BoardIds => _boardIds.AsReadOnly();

    public Guid OwnedByUserId { get; private set; }

    private readonly List<Guid> _projectManagerIds = new();
    public IReadOnlyCollection<Guid> ProjectManagerIds => _projectManagerIds.AsReadOnly();
    
    private Project() {  }

    public Project(string name, Guid ownerId)
    {
        ProjectName = name;
        OwnedByUserId = ownerId;
    }

    public void AddBoard(int boardId, Guid userId)
    {
        if (!_boardIds.Contains(boardId))
        {
            throw new BoardAlreadyExistsException();
        }

        if (!_projectManagerIds.Contains(userId) && userId != OwnedByUserId)
        {
            throw new BoardPermissionException("The user is neither a project manager nor the project owner!");
        }
        
        _boardIds.Add(boardId);
    }
}    