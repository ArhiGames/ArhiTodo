using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories;

public interface IProjectRepository
{
    Task<Project> CreateAsync(Project project);
    Task<bool> DeleteAsync(int projectId);
    Task<Project?> GetAsync(int projectId);
    Task<List<Project>> GetAllAsync();
}