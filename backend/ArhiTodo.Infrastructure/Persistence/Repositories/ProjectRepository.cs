using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class ProjectRepository(ProjectDataBase projectDatabase) : IProjectRepository
{
    public async Task<Project> CreateAsync(Project project)
    {
        EntityEntry<Project> createdProject = projectDatabase.Projects.Add(project);
        await projectDatabase.SaveChangesAsync();
        return createdProject.Entity;
    }

    public async Task<Project?> UpdateProject(Project project)
    {
        Project? foundProject = await projectDatabase.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == project.ProjectId);
        if (foundProject == null) return null;

        foundProject.ProjectName = project.ProjectName;
        await projectDatabase.SaveChangesAsync();

        return foundProject;
    }

    public async Task<bool> DeleteAsync(int projectId)
    {
        Project? project = await projectDatabase.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null) return false;

        projectDatabase.Projects.Remove(project);
        await projectDatabase.SaveChangesAsync();
        
        return true;
    }

    public async Task<Project?> GetAsync(int projectId)
    {
        Project? project = await projectDatabase.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        return project;
    }

    public async Task<List<Project>> GetAllAsync()
    {
        List<Project> projects = await projectDatabase.Projects.ToListAsync();
        return projects;
    }
}