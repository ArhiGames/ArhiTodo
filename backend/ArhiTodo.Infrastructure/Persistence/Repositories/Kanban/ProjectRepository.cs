using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

public class ProjectRepository(ProjectDataBase database) : IProjectRepository
{
    public async Task<ProjectManager?> AddProjectManager(ProjectManager projectManager)
    {
        EntityEntry<ProjectManager> entityEntryProjectManager = database.ProjectManagers.Add(projectManager);
        await database.SaveChangesAsync();
        return entityEntryProjectManager.Entity;
    }

    public async Task<bool> RemoveProjectManager(int projectId, Guid userId)
    {
        int changedRows = await database.ProjectManagers
            .Where(pm => pm.ProjectId == projectId && pm.UserId == userId)
            .ExecuteDeleteAsync();
        return changedRows >= 1;
    }

    public async Task<List<User>> GetProjectManagers(int projectId)
    {
        List<User> projectMangers = await database.Users
            .Include(u => u.ProjectManagers)
            .Where(u => u.ProjectManagers.Any(pm => pm.ProjectId == projectId))
            .ToListAsync();
        return projectMangers;
    }

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