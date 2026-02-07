using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface ILabelService
{
    Task<Result<LabelGetDto>> CreateLabel(int boardId, LabelCreateDto labelCreateDto);
    Task<Result<LabelGetDto>> UpdateLabel(int boardId, LabelUpdateDto labelUpdateDto);
    Task<bool> DeleteLabel(int boardId, int labelId);
    Task<List<LabelGetDto>?> GetEveryLabel(int boardId);
    
    Task<bool> AddLabelToCard(int boardId, int cardId, int labelId);
    Task<bool> RemoveLabelFromCard(int boardId, int cardId, int labelId);
}