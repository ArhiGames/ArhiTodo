using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories.Kanban;

public interface ILabelRepository
{
    Task<Label?> CreateLabelAsync(Label label);
    Task<bool> DeleteLabelAsync(int labelId);
    Task<List<Label>> GetAllAsync(int boardId);
}
