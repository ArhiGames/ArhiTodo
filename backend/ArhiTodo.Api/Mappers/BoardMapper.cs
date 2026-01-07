using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Post;

namespace ArhiTodo.Mappers;

public static class BoardMapper
{
    public static Board FromPostDto(this BoardPostDto boardPostDto)
    {
        return new Board()
        {
            BoardName = boardPostDto.BoardName
        };
    }
    
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