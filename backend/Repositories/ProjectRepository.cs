using ArhiTodo.DataBase;
using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Post;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly ProjectDataBase _projectDatabase;
    
    public ProjectRepository(ProjectDataBase projectDatabase)
    {
        _projectDatabase = projectDatabase;
    }

    public async Task<Project> CreateAsync(ProjectPostDto projectPostDto)
    {
        Project newProject = new()
        {
            ProjectName = projectPostDto.ProjectName
        };

        _projectDatabase.Projects.Add(newProject);
        await _projectDatabase.SaveChangesAsync();
        
        return newProject;
    }

    public async Task<bool> DeleteAsync(int projectId)
    {
        Project? project = await _projectDatabase.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null) return false;

        _projectDatabase.Projects.Remove(project);
        await _projectDatabase.SaveChangesAsync();
        
        return true;
    }

    public async Task<Project?> GetAsync(int projectId)
    {
        Project? project = await _projectDatabase.Projects
            .Include(p => p.Boards)
                .ThenInclude(b => b.CardLists)
                    .ThenInclude(cl => cl.Cards)
            .Where(p => p.ProjectId == projectId)
            .FirstOrDefaultAsync();
        return project ?? throw new InvalidOperationException("Not found");
    }

    public async Task<List<Project>> GetAllAsync()
    {
        List<Project> projects = await _projectDatabase.Projects.ToListAsync();
        return projects;
    }
}