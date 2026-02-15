using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class BoardMapper
{
    public static BoardGetDto ToGetDto(this Board board)
    {
        return new BoardGetDto
        {
            BoardId = board.BoardId,
            Position = board.Position,
            BoardName = board.BoardName,
            OwnedByUserId = board.OwnerId,
            CardLists = board.CardLists.Select(cl => cl.ToGetDto()).ToList()
        };
    }
}