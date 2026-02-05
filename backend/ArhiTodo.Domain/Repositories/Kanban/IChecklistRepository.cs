using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface IChecklistRepository
{
    Task<Checklist?> CreateChecklistOnCard(Checklist checklist);
    Task<bool> DeleteChecklistFromCard(int checkListId);
}