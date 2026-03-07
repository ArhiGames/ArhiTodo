using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Authorization;

public class ProjectAuthorizer(ProjectDataBase database, ICurrentUser currentUser) : IProjectAuthorizer
{
    public async Task<bool> HasViewProjectPermissions(int projectId)
    {
        bool hasViewProjectPermission = await database.Projects.AnyAsync(p => 
            p.OwnerId == currentUser.UserId || 
            p.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) || 
            p.Boards.Any(b => b.BoardUserClaims.Any(buc => 
                buc.UserId == currentUser.UserId && 
                buc.Type == BoardClaimTypes.ViewBoard && 
                buc.Value)));
        return hasViewProjectPermission;
    }
}