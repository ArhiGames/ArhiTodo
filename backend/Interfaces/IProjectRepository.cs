using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;

namespace ArhiTodo.Interfaces;

public interface IProjectRepository
{
    Task<Project> CreateAsync(ProjectPostDto projectPostDto);
    Task<bool> DeleteAsync(int projectId);
    Task<Project?> GetAsync(int projectId);
    Task<List<Project>> GetAllAsync();
}