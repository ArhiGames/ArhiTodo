using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface ICardNotificationService
{
    void CreateCard(int boardId, int cardListId, CardGetDto card);
    void DeleteCard(int boardId, int cardId);
    void UpdateCardUrgency(int boardId, int cardId, CardUrgencyLevel cardUrgencyLevel);
    void MoveCard(int boardId, int cardId, int toCardList, int toIndex);
    void AssignUser(int boardId, int cardId, Guid userId);
    void RemoveAssignedUser(int boardId, int cardId, Guid userId);
    void PatchCardName(int boardId, int cardId, CardGetDto card);
    void PathCardStatus(int boardId, int cardId, bool isDone);
}