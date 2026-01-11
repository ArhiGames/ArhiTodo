using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;

namespace ArhiTodo.Application.Services.Interfaces;

public interface IChecklistService
{
    Task<ChecklistGetDto?> CreateChecklist(int cardId, ChecklistCreateDto checklistCreateDto);
    Task<bool> DeleteChecklist(int checklistId);
    
    Task<ChecklistItemGetDto?> CreateChecklistItem(int checklistId, ChecklistItemCreateDto checklistItemCreateDto);
    Task<bool> DeleteChecklistItem(int checklistItemId);
    Task<bool> PatchChecklistItemState(int checklistItemId, bool newState);
}