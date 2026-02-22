using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Authorization;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Authorization;

public class CardAuthorizer(ICurrentUser currentUser, IAuthorizationService authorizationService, ProjectDataBase database) : ICardAuthorizer
{
    private async Task<bool> HasCardPermission(int cardId, BoardClaimTypes boardClaimTypes, string? optionalPolicy, bool validAsAssignedUser = false)
    {
        bool hasEditCardPermission = await database.Cards
            .AnyAsync(c => c.CardId == cardId && (
                (validAsAssignedUser && c.AssignedUsers.Any(asu => asu.UserId == currentUser.UserId)) ||
                c.CardList.Board.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                c.CardList.Board.BoardUserClaims.Any(buc =>
                    buc.UserId == currentUser.UserId && buc.Type == boardClaimTypes &&
                    buc.Value)));
        if (hasEditCardPermission) return true;
        if (optionalPolicy is null) return false;

        bool hasGlobalPermission = await authorizationService.CheckPolicy(optionalPolicy);
        return hasGlobalPermission;
    }
    
    public async Task<bool> HasCreateCardPermission(int cardListId)
    {
        bool hasEditCardPermission = await database.CardLists
            .AnyAsync(cl => cl.CardListId == cardListId && (
                cl.Board.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                cl.Board.BoardUserClaims.Any(buc =>
                    buc.UserId == currentUser.UserId && buc.Type == BoardClaimTypes.ManageCards &&
                    buc.Value)));
        if (hasEditCardPermission) return true;

        bool hasGlobalPermission = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        return hasGlobalPermission;
    }

    public async Task<bool> HasEditCardPermission(int cardId, bool validAsAssignedUser = false)
    {
        return await HasCardPermission(cardId, BoardClaimTypes.ManageCards,
            nameof(UserClaimTypes.ModifyOthersProjects), validAsAssignedUser);
    }

    public async Task<bool> HasDeleteCardPermission(int cardId)
    {
        return await HasCardPermission(cardId, BoardClaimTypes.ManageCards,
            nameof(UserClaimTypes.ModifyOthersProjects));
    }

    public async Task<bool> HasViewCardPermission(int cardId)
    {
        return await HasCardPermission(cardId, BoardClaimTypes.ViewBoard,
            nameof(UserClaimTypes.ModifyOthersProjects));
    }
}