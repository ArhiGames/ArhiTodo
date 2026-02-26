using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Authorization;

public class LabelAuthorizer(ProjectDataBase database, ICurrentUser currentUser) : ILabelAuthorizer
{
    private async Task<bool> HasLabelPermission(int labelId, BoardClaimTypes boardClaimTypes)
    {
        bool hasEditLabelPermission = await database.Labels
            .AnyAsync(l => l.LabelId == labelId && (
                l.Board.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                l.Board.BoardUserClaims.Any(buc =>
                    buc.UserId == currentUser.UserId && buc.Type == boardClaimTypes &&
                    buc.Value)));
        return hasEditLabelPermission;
    }
    
    public async Task<bool> HasCreateLabelPermission(int boardId)
    {
        bool hasCreateLabelPermission = await database.Boards
            .AnyAsync(b => b.BoardId == boardId && (
                b.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                b.BoardUserClaims.Any(buc =>
                    buc.UserId == currentUser.UserId && buc.Type == BoardClaimTypes.ManageLabels &&
                    buc.Value)));
        return hasCreateLabelPermission;
    }

    public async Task<bool> HasEditLabelPermission(int labelId)
    {
        return await HasLabelPermission(labelId, BoardClaimTypes.ManageLabels);
    }

    public async Task<bool> HasDeleteLabelPermission(int labelId)
    {
        return await HasLabelPermission(labelId, BoardClaimTypes.ManageLabels);
    }
}