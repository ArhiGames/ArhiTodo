using ArhiTodo.Application.DTOs.Checklist;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface IChecklistNotificationService
{
    void CreateChecklist(int boardId, int cardId, ChecklistGetDto checklistGetDto);
    void UpdateChecklist(int boardId, int cardId, ChecklistGetDto checklistGetDto);
    void DeleteChecklist(int boardId, int checklistId);
}