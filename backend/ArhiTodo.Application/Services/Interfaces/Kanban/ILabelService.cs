using ArhiTodo.Application.DTOs.Label;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface ILabelService
{
    Task<LabelGetDto?> CreateLabel(int boardId, LabelCreateDto labelCreateDto);
    Task<LabelGetDto?> UpdateLabel(int boardId, LabelUpdateDto labelUpdateDto);
    Task<bool> DeleteLabel(int boardId, int labelId);
    Task<List<LabelGetDto>> GetEveryLabel(int boardId);
    
    Task<bool> AddLabelToCard(int cardId, int labelId);
    Task<bool> RemoveLabelFromCard(int cardId, int labelId);
}