using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Application.Mappers;

public static class BoardMapper
{
    public static Board FromCreateDto(this BoardCreateDto boardCreateDto, int projectId)
    {
        return new Board
        {
            ProjectId = projectId,
            BoardName = boardCreateDto.BoardName
        };
    }

    public static Board FromUpdateDto(this BoardUpdateDto boardUpdateDto)
    {
        return new Board
        {
            BoardId = boardUpdateDto.BoardId,
            BoardName = boardUpdateDto.BoardName
        };
    }

    public static BoardGetDto ToGetDto(this Board board)
    {
        return new BoardGetDto
        {
            BoardId = board.BoardId,
            BoardName = board.BoardName,
            CardLists = board.CardLists.Select(cl => cl.ToGetDto()).ToList()
        };
    }
}