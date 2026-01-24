using ArhiTodo.Application.DTOs.Label;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface ILabelNotificationService
{
    void CreateLabel(int boardId, LabelGetDto label);
    void UpdateLabel(int boardId, LabelGetDto label);
    void DeleteLabel(int boardId, int labelId);

    void AddLabelToCard(int boardId, int cardId, int labelId);
    void RemoveLabelFromCard(int boardId, int cardId, int labelId);
}