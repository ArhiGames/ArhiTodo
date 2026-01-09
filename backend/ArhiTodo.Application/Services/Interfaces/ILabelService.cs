using ArhiTodo.Application.DTOs.Label;

namespace ArhiTodo.Application.Services.Interfaces;

public interface ILabelService
{
    Task<LabelGetDto?> CreateLabel(int boardId, LabelCreateDto labelCreateDto);
    Task<bool> UpdateLabel(LabelUpdateDto labelUpdateDto);
    Task<bool> DeleteLabel(int labelId);
    Task<List<LabelGetDto>> GetEveryLabel(int boardId);
    
    Task<bool> AddLabelToCard(int cardId, int labelId);
    Task<bool> RemoveLabelFromCard(int cardId, int labelId);
}