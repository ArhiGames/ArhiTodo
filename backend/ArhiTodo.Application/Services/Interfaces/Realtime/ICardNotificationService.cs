using ArhiTodo.Application.DTOs.Card;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface ICardNotificationService
{
    void CreateCard(int boardId, int cardListId, CardGetDto card);
    void DeleteCard(int boardId, int cardId);
    void PatchCardName(int boardId, int cardId, CardGetDto card);
    void PathCardStatus(int boardId, int cardId, bool isDone);
}