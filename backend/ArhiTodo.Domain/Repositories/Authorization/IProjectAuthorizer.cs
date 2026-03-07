namespace ArhiTodo.Domain.Repositories.Authorization;

public interface IProjectAuthorizer
{
    Task<bool> HasViewProjectPermissions(int projectId);
}