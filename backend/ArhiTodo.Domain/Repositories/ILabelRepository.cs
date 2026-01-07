using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Domain.Repositories;

public interface ILabelRepository
{
    Task<bool> AddLabelToCard(int cardId, int labelId);
    Task<bool> RemoveLabelFromCard(int cardId, int labelId);
    Task<Label?> CreateLabelAsync(int boardId, LabelPostDto labelPostDto);
    Task<Label?> UpdateLabelAsync(LabelPutDto labelPutDto);
    Task<bool> DeleteLabelAsync(int labelId);
    Task<List<Label>> GetAllAsync(int boardId);
}
