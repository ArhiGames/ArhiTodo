namespace ArhiTodo.Domain.Repositories.Authorization;

public interface ICardListAuthorizer
{
    Task<bool> HasCreateCardListPermission(int boardId);
    Task<bool> HasEditCardListPermission(int cardListId);
    Task<bool> HasDeleteCardsFromCardListPermission(int cardListId);
    Task<bool> HasDeleteCardListPermission(int cardListId);
}