namespace ArhiTodo.Domain.Repositories.Authorization;

public interface IBoardAuthorizer
{
    Task<bool> HasCreateBoardPermission(int projectId);
    Task<bool> HasBoardEditPermission(int boardId);
    Task<bool> HasBoardEditUsersPermission(int boardId);
    Task<bool> HasBoardDeletePermission(int boardId);
    Task<bool> HasBoardViewPermission(int boardId);
}