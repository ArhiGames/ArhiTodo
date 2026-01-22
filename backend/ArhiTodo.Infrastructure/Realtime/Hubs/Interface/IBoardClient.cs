using ArhiTodo.Application.DTOs.Board;

namespace ArhiTodo.Infrastructure.Realtime.Hubs.Interface;

public interface IBoardClient
{
    Task CreateBoard(int projectId, BoardGetDto boardGetDto);
    Task UpdateBoard(int projectId, BoardGetDto boardGetDto);
    Task DeleteBoard(int boardId);
}