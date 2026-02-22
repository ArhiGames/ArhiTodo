namespace ArhiTodo.Domain.Repositories.Authorization;

public interface ICardAuthorizer
{
    Task<bool> HasCreateCardPermission(int cardListId);
    Task<bool> HasEditCardPermission(int cardId, bool validAsAssignedUser = false);
    Task<bool> HasDeleteCardPermission(int cardId);
    Task<bool> HasViewCardPermission(int cardId);
}