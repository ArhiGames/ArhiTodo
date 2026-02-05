namespace ArhiTodo.Domain.Repositories.Common;

public interface IUnitOfWork
{
    Task SaveChangesAsync();
}