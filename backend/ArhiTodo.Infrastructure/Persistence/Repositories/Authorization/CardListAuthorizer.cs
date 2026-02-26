using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Authorization;

public class CardListAuthorizer(ICurrentUser currentUser, ProjectDataBase database) : ICardListAuthorizer
{
    private async Task<bool> HasCardListPermission(int cardListId, BoardClaimTypes permission)
    {
        bool hasCreateCardListPermission = await database.CardLists
            .AnyAsync(cl => cl.CardListId == cardListId && (
                cl.Board.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                cl.Board.BoardUserClaims.Any(buc =>
                    buc.UserId == currentUser.UserId && buc.Type == permission &&
                    buc.Value)));
        return hasCreateCardListPermission;
    }
    
    public async Task<bool> HasCreateCardListPermission(int boardId)
    {
        bool hasCreateCardListPermission = await database.Boards
            .AnyAsync(b => b.BoardId == boardId && (
                b.Project.ProjectManagers.Any(pm => pm.UserId == currentUser.UserId) ||
                b.BoardUserClaims.Any(buc =>
                    buc.UserId == currentUser.UserId && buc.Type == BoardClaimTypes.ManageCardLists &&
                    buc.Value)));
        return hasCreateCardListPermission;
    }

    public async Task<bool> HasEditCardListPermission(int cardListId)
    {
        return await HasCardListPermission(cardListId, BoardClaimTypes.ManageCardLists);
    }

    public async Task<bool> HasDeleteCardsFromCardListPermission(int cardListId)
    {
        return await HasCardListPermission(cardListId, BoardClaimTypes.ManageCards);
    }

    public async Task<bool> HasDeleteCardListPermission(int cardListId)
    {
        return await HasCardListPermission(cardListId, BoardClaimTypes.ManageCardLists);
    }
}