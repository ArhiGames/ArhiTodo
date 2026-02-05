using ArhiTodo.Domain.Repositories.Common;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Common;

public class UnitOfWork(ProjectDataBase database) : IUnitOfWork
{
    public async Task SaveChangesAsync()
    {
        await database.SaveChangesAsync();
    }
}