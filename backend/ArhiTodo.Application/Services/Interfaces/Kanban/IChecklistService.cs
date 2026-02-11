using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IChecklistService
{
    Task<Result<ChecklistGetDto>> CreateChecklist(int boardId, int cardId, ChecklistCreateDto checklistCreateDto);
    Task<Result<ChecklistGetDto>> UpdateChecklist(int boardId, int cardId, ChecklistUpdateDto checklistUpdateDto);
    Task<Result> DeleteChecklist(int boardId, int cardId, int checklistId);
    
    Task<Result<ChecklistItemGetDto>> CreateChecklistItem(int boardId, int cardId, int checklistId, ChecklistItemCreateDto checklistItemCreateDto);
    Task<Result> DeleteChecklistItem(int boardId, int cardId, int checklistId, int checklistItemId);
    Task<Result<ChecklistItemGetDto>> UpdateChecklistItem(int boardId, int cardId, int checklistId, ChecklistItemUpdateDto checklistItemUpdateDto);
    Task<Result<ChecklistItemGetDto>> PatchChecklistItemState(int boardId, int cardId, int checklistItemId, bool newState);
}