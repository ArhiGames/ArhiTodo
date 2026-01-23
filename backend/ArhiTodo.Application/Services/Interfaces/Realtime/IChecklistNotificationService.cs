using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface IChecklistNotificationService
{
    void CreateChecklist(int boardId, int cardId, ChecklistGetDto checklistGetDto);
    void UpdateChecklist(int boardId, int cardId, ChecklistGetDto checklistGetDto);
    void DeleteChecklist(int boardId, int checklistId);

    void CreateChecklistItemOnChecklist(int boardId, int checklistId, ChecklistItemGetDto checklistItemGetDto);
    void UpdateChecklistItem(int boardId, int checklistId, ChecklistItemGetDto checklistItemGetDto);
    void PatchChecklistItemDoneState(int boardId, int checklistItemId, bool taskDone);
    void DeleteChecklistItemFromChecklist(int boardId, int checklistId, int checklistItemId);
}