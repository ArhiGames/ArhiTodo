using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Repositories;

public interface ILabelRepository
{
    Task<Label?> CreateLabelAsync(Label label);
    Task<bool> UpdateLabelAsync(int labelId, string? labelText, int? labelColor);
    Task<bool> DeleteLabelAsync(int labelId);
    Task<List<Label>> GetAllAsync(int boardId);
    
    Task<CardLabel?> AddLabelToCard(int cardId, int labelId);
    Task<bool> RemoveLabelFromCard(int cardId, int labelId);
}
