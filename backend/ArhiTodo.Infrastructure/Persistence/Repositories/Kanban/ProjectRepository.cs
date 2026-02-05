using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

public class ProjectRepository(ProjectDataBase database) : IProjectRepository
{
    public async Task<Project> CreateAsync(Project project)
    {
        EntityEntry<Project> createdProject = database.Projects.Add(project);
        await database.SaveChangesAsync();
        return createdProject.Entity;
    }

    public async Task<Project?> UpdateProject(Project project)
    {
        Project? foundProject = await database.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == project.ProjectId);
        if (foundProject == null) return null;

        foundProject.ProjectName = project.ProjectName;
        await database.SaveChangesAsync();

        return foundProject;
    }

    public async Task<bool> DeleteAsync(int projectId)
    {
        Project? project = await database.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        if (project == null) return false;

        database.Projects.Remove(project);
        await database.SaveChangesAsync();
        
        return true;
    }

    public async Task<Project?> GetAsync(int projectId)
    {
        Project? project = await database.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        return project;
    }

    public async Task<List<Project>> GetAllAsync()
    {
        List<Project> projects = await database.Projects.ToListAsync();
        return projects;
    }
}