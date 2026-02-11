namespace ArhiTodo.Domain.Repositories.Authorization;

public interface ILabelAuthorizer
{
    Task<bool> HasCreateLabelPermission(int boardId);
    Task<bool> HasEditLabelPermission(int labelId);
    Task<bool> HasDeleteLabelPermission(int labelId);
}