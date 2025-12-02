using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;

namespace ArhiTodo.Mappers;

public static class BoardMapper
{
    public static BoardGetDto ToBoardGetDto(this Board board)
    {
        return new BoardGetDto()
        {
            BoardId = board.BoardId,
            BoardName = board.BoardName,
            CardLists = board.CardLists.Select(cl => cl.ToCardlistGetDto()).ToList()
        };
    }
}