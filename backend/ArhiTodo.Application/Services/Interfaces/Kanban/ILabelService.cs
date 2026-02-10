using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface ILabelService
{
    Task<Result<LabelGetDto>> CreateLabel(int boardId, LabelCreateDto labelCreateDto);
    Task<Result<LabelGetDto>> UpdateLabel(int boardId, LabelUpdateDto labelUpdateDto);
    Task<Result> DeleteLabel(int boardId, int labelId);
    
    Task<Result> AddLabelToCard(int boardId, int cardId, int labelId);
    Task<Result> RemoveLabelFromCard(int boardId, int cardId, int labelId);
}