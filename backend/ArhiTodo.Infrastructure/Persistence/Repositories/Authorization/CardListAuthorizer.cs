using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authorization;
using Microsoft.EntityFrameworkCore;
using IAuthorizationService = ArhiTodo.Application.Services.Interfaces.Authorization.IAuthorizationService;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Authorization;

public class CardListAuthorizer(ICurrentUser currentUser, IAuthorizationService authorizationService, ProjectDataBase database) : ICardListAuthorizer
{
    private async Task<bool> HasCardListPermission(int cardListId, BoardClaimTypes permission, string? optionalPolicy)
    {
        bool hasCreateCardListPermission = await database.CardLists
            .AnyAsync(cl => cl.CardListId == cardListId && (
                cl.Board.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                cl.Board.BoardUserClaims.Any(buc =>
                    buc.UserId == currentUser.UserId && buc.Type == permission &&
                    buc.Value)));
        if (hasCreateCardListPermission) return true;
        if (optionalPolicy is null) return false;
        
        bool fulfillsPolicyGlobally = await authorizationService.CheckPolicy(optionalPolicy);
        return fulfillsPolicyGlobally;
    }
    
    public async Task<bool> HasCreateCardListPermission(int boardId)
    {
        bool hasCreateCardListPermission = await database.Boards
            .AnyAsync(b => b.BoardId == boardId && (
                b.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                b.BoardUserClaims.Any(buc =>
                    buc.UserId == currentUser.UserId && buc.Type == BoardClaimTypes.ManageCardLists &&
                    buc.Value)));
        if (hasCreateCardListPermission) return true;
        
        bool fulfillsPolicyGlobally = await authorizationService.CheckPolicy(nameof(UserClaimTypes.ModifyOthersProjects));
        return fulfillsPolicyGlobally;
    }

    public async Task<bool> HasEditCardListPermission(int cardListId)
    {
        return await HasCardListPermission(cardListId, BoardClaimTypes.ManageCardLists,
            nameof(UserClaimTypes.ModifyOthersProjects));
    }

    public async Task<bool> HasDeleteCardsFromCardListPermission(int cardListId)
    {
        return await HasCardListPermission(cardListId, BoardClaimTypes.ManageCards,
            nameof(UserClaimTypes.ModifyOthersProjects));
    }

    public async Task<bool> HasDeleteCardListPermission(int cardListId)
    {
        return await HasCardListPermission(cardListId, BoardClaimTypes.ManageCardLists,
            nameof(UserClaimTypes.ModifyOthersProjects));
    }
}