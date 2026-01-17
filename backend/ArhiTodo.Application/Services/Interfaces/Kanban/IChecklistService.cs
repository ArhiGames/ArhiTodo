using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface IChecklistService
{
    Task<ChecklistGetDto?> CreateChecklist(int cardId, ChecklistCreateDto checklistCreateDto);
    Task<ChecklistGetDto?> UpdateChecklist(int cardId, ChecklistUpdateDto checklistUpdateDto);
    Task<bool> DeleteChecklist(int checklistId);
    
    Task<ChecklistItemGetDto?> CreateChecklistItem(int checklistId, ChecklistItemCreateDto checklistItemCreateDto);
    Task<ChecklistItemGetDto?> UpdateChecklistItem(int checklistId, ChecklistItemUpdateDto checklistItemUpdateDto);
    Task<bool> DeleteChecklistItem(int checklistItemId);
    Task<ChecklistItemGetDto?> PatchChecklistItemState(int checklistItemId, bool newState);
}