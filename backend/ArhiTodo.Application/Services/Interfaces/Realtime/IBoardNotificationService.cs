using ArhiTodo.Application.DTOs.Board;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface IBoardNotificationService
{
    void CreateBoard(Guid invokedBy, int projectId, BoardGetDto boardGetDto);
    void DeleteBoard(Guid invokedBy, int boardId);
}