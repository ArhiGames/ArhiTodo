using ArhiTodo.DataBase;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Services;

public class ProjectService
{
    private readonly ProjectDataBase _projectDatabase;
    
    public ProjectService(ProjectDataBase projectDatabase)
    {
        _projectDatabase = projectDatabase;
    }

    public async Task<Project> CreateProject(ProjectPostDto projectPostDto)
    {
        Project newProject = new()
        {
            ProjectName = projectPostDto.ProjectName
        };

        _projectDatabase.Projects.Add(newProject);
        await _projectDatabase.SaveChangesAsync();
        
        return newProject;
    }

    public async Task<bool> DeleteProject(int id)
    {
        Project? project = await _projectDatabase.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == id);
        if (project == null) return false;

        _projectDatabase.Projects.Remove(project);
        await _projectDatabase.SaveChangesAsync();
        
        return true;
    }

    public async Task<List<Project>> GetAllProjects()
    {
        List<Project> projects = await _projectDatabase.Projects.ToListAsync();
        return projects;
    }
}