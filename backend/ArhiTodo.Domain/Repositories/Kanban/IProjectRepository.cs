using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IProjectRepository
{
    Task<Project> CreateAsync(Project project);
    Task RemoveAsync(Project project);
    Task<Project?> GetAsync(int projectId);
    Task<Project?> GetAsyncIncludingBoards(int projectId);
    Task<List<Project>> GetAllAsync(Guid userId);
}