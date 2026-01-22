using ArhiTodo.Application.DTOs.Board;

namespace ArhiTodo.Infrastructure.Realtime.Hubs.Interface;

public interface IBoardClient
{
    Task CreateBoard(int projectId, BoardGetDto board);
    Task UpdateBoard(int projectId, BoardGetDto board);
    Task DeleteBoard(int boardId);
}