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

    public async Task<bool> DeleteAsync(int projectId)
    {
        int changedRows = await database.Projects
            .Where(p => p.ProjectId == projectId)
            .ExecuteDeleteAsync();
        return changedRows == 1;
    }

    public async Task<Project?> GetAsync(int projectId)
    {
        Project? project = await database.Projects
            .Include(p => p.Owner)
            .Include(p => p.ProjectManagers)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        return project;
    }

    public async Task<List<Project>> GetAllAsync()
    {
        List<Project> projects = await database.Projects.ToListAsync();
        return projects;
    }
}