using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Domain.Repositories;

public interface IProjectRepository
{
    Task<Project> CreateAsync(Project project);
    Task<bool> DeleteAsync(int projectId);
    Task<List<Project>> GetAllAsync();
}