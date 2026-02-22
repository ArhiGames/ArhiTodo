using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Authorization;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Authorization;

public class BoardAuthorizer(ICurrentUser currentUser, IAuthorizationService authorizationService, ProjectDataBase database) : IBoardAuthorizer
{
    private async Task<bool> HasBoardPermission(int boardId, BoardClaimTypes boardClaimTypes, string? optionalPolicy)
    {
        bool hasPermission = await database.Boards
            .AnyAsync(b => b.BoardId == boardId &&
                           (b.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                            b.BoardUserClaims.Any(buc =>
                                buc.UserId == currentUser.UserId && buc.Type == boardClaimTypes &&
                                buc.Value)));
        if (hasPermission) return true;
        if (optionalPolicy is null) return false;

        bool fulfillsPolicyGlobally = await authorizationService.CheckPolicy(optionalPolicy);
        return fulfillsPolicyGlobally;
    }

    public async Task<bool> HasCreateBoardPermission(int projectId)
    {
        bool hasBoardCreatePermission = await database.Projects
            .AnyAsync(p => p.ProjectId == projectId &&
                           p.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId));
        if (hasBoardCreatePermission) return true;
        
        bool fulfillsPolicyGlobally = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        return fulfillsPolicyGlobally;
    }

    public async Task<bool> HasBoardEditPermission(int boardId)
    {
        return await HasBoardPermission(boardId, BoardClaimTypes.ManageBoard, nameof(UserClaimTypes.ModifyOthersProjects));
    }

    public async Task<bool> HasBoardEditUsersPermission(int boardId)
    {
        return await HasBoardPermission(boardId, BoardClaimTypes.ManageUsers, nameof(UserClaimTypes.ModifyOthersProjects));
    }

    public async Task<bool> HasBoardDeletePermission(int boardId)
    {
        bool hasDeletePermission = await database.Boards
            .AnyAsync(b => b.BoardId == boardId &&
                           (b.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                            b.OwnerId == currentUser.UserId));
        if (hasDeletePermission) return true;
        
        bool fulfillsPolicyGlobally = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        return fulfillsPolicyGlobally;
    }

    public async Task<bool> HasBoardViewPermission(int boardId)
    {
        return await HasBoardPermission(boardId, BoardClaimTypes.ViewBoard, nameof(UserClaimTypes.ModifyOthersProjects));
    }
}