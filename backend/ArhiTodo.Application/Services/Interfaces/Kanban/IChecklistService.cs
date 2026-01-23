using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IChecklistService
{
    Task<ChecklistGetDto?> CreateChecklist(int boardId, int cardId, ChecklistCreateDto checklistCreateDto);
    Task<ChecklistGetDto?> UpdateChecklist(int boardId, int cardId, ChecklistUpdateDto checklistUpdateDto);
    Task<bool> DeleteChecklist(int boardId, int checklistId);
    
    Task<ChecklistItemGetDto?> CreateChecklistItem(int boardId, int checklistId, ChecklistItemCreateDto checklistItemCreateDto);
    Task<ChecklistItemGetDto?> UpdateChecklistItem(int boardId, int checklistId, ChecklistItemUpdateDto checklistItemUpdateDto);
    Task<bool> DeleteChecklistItem(int boardId, int checklistId, int checklistItemId);
    Task<ChecklistItemGetDto?> PatchChecklistItemState(int boardId, int checklistItemId, bool newState);
}