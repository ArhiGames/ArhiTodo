using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Domain.Repositories;

public interface IProjectRepository
{
    Task<Project> CreateAsync(ProjectPostDto projectPostDto);
    Task<bool> DeleteAsync(int projectId);
    Task<Project?> GetAsync(int projectId);
    Task<List<Project>> GetAllAsync();
}