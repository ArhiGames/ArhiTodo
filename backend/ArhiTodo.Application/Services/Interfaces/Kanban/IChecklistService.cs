using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IChecklistService
{
    Task<ChecklistGetDto?> CreateChecklist(int boardId, int cardId, ChecklistCreateDto checklistCreateDto);
    Task<ChecklistGetDto?> UpdateChecklist(int boardId, int cardId, ChecklistUpdateDto checklistUpdateDto);
    Task<bool> DeleteChecklist(int boardId, int cardId, int checklistId);
    
    Task<ChecklistItemGetDto?> CreateChecklistItem(int boardId, int cardId, int checklistId, ChecklistItemCreateDto checklistItemCreateDto);
    Task<bool> DeleteChecklistItem(int boardId, int cardId, int checklistId, int checklistItemId);
    Task<ChecklistItemGetDto?> UpdateChecklistItem(int boardId, int cardId, int checklistId, ChecklistItemUpdateDto checklistItemUpdateDto);
    Task<ChecklistItemGetDto?> PatchChecklistItemState(int boardId, int cardId, int checklistItemId, bool newState);
}