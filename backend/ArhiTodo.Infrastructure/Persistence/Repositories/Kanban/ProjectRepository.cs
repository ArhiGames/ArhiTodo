using ArhiTodo.Domain.Entities.Auth;
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

    public async Task RemoveAsync(Project project)
    {
        database.Projects.Remove(project);
        await database.SaveChangesAsync();
    }

    public async Task<Project?> GetAsync(int projectId)
    {
        Project? project = await database.Projects
            .Include(p => p.Owner)
            .Include(p => p.ProjectManagers)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        return project;
    }

    public async Task<Project?> GetAsync(int projectId, Guid userId)
    {
        Project? project = await database.Projects
            .Include(p => p.Owner)
            .Include(p => p.ProjectManagers)
            .FirstOrDefaultAsync(p => p.ProjectId == projectId &&
                                      (p.OwnerId == userId ||
                                      p.ProjectManagers.Any(pm => pm.UserId == userId) ||
                                      p.Boards.Any(b => b.BoardUserClaims.Any(buc =>
                                          buc.UserId == userId &&
                                          buc.Type == BoardClaimTypes.ViewBoard &&
                                          buc.Value == "true"))));
        return project;
    }

    public async Task<List<Project>> GetAllAsync()
    {
        List<Project> projects = await database.Projects.ToListAsync();
        return projects;
    }

    public async Task<List<Project>> GetAllAsync(Guid userId)
    {
        List<Project> projects = await database.Projects
            .Where(p => p.OwnerId == userId || 
                        p.ProjectManagers.Any(pm => pm.UserId == userId) || 
                        p.Boards.Any(b => b.BoardUserClaims.Any(buc => 
                            buc.UserId == userId && 
                            buc.Type == BoardClaimTypes.ViewBoard && 
                            buc.Value == "true")))
            .ToListAsync();
        return projects;
    }
}