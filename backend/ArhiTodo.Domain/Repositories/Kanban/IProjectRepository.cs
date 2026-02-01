using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IProjectRepository
{
    Task<ProjectManager> AddProjectManager(ProjectManager projectManager);
    Task<bool> RemoveProjectManager(int projectId, Guid userId);
    Task<List<User>> GetProjectManagers(int projectId);
    
    Task<Project> CreateAsync(Project project);
    Task<Project?> UpdateProject(Project project);
    Task<bool> DeleteAsync(int projectId);
    Task<Project?> GetAsync(int projectId);
    Task<List<Project>> GetAllAsync();
}