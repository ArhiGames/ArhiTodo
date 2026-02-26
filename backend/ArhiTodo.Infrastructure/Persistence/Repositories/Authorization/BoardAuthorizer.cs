using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Authorization;

public class BoardAuthorizer(ICurrentUser currentUser, ProjectDataBase database) : IBoardAuthorizer
{
    private async Task<bool> HasBoardPermission(int boardId, BoardClaimTypes boardClaimTypes)
    {
        bool hasPermission = await database.Boards
            .AnyAsync(b => b.BoardId == boardId &&
                           (b.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                            b.BoardUserClaims.Any(buc =>
                                buc.UserId == currentUser.UserId && buc.Type == boardClaimTypes &&
                                buc.Value)));
        return hasPermission;
    }

    public async Task<bool> HasCreateBoardPermission(int projectId)
    {
        bool hasBoardCreatePermission = await database.Projects
            .AnyAsync(p => p.ProjectId == projectId &&
                           p.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId));
        return hasBoardCreatePermission;
    }

    public async Task<bool> HasBoardEditPermission(int boardId)
    {
        return await HasBoardPermission(boardId, BoardClaimTypes.ManageBoard);
    }

    public async Task<bool> HasBoardEditUsersPermission(int boardId)
    {
        return await HasBoardPermission(boardId, BoardClaimTypes.ManageUsers);
    }

    public async Task<bool> HasBoardDeletePermission(int boardId)
    {
        bool hasDeletePermission = await database.Boards
            .AnyAsync(b => b.BoardId == boardId &&
                           (b.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                            b.OwnerId == currentUser.UserId));
        return hasDeletePermission;
    }

    public async Task<bool> HasBoardViewPermission(int boardId)
    {
        return await HasBoardPermission(boardId, BoardClaimTypes.ViewBoard);
    }
}