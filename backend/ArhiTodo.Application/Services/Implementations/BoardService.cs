using ArhiTodo.Application.DTOs.Board;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces;
using ArhiTodo.Domain.Entities;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations;

public class BoardService(IBoardRepository boardRepository) : IBoardService
{
    public async Task<BoardGetDto?> CreateBoard(int projectId, BoardCreateDto boardCreateDto)
    {
        Board? board = await boardRepository.CreateAsync(boardCreateDto.FromCreateDto(projectId));
        return board?.ToGetDto();
    }

    public async Task<BoardGetDto?> UpdateBoard(int projectId, BoardUpdateDto boardUpdateDto)
    {
        Board? board = await boardRepository.UpdateAsync(boardUpdateDto.FromUpdateDto());
        return board?.ToGetDto();
    }

    public async Task<bool> DeleteBoard(int boardId)
    {
        bool succeeded = await boardRepository.DeleteAsync(boardId);
        return succeeded;
    }

    public async Task<List<BoardGetDto>> GetEveryBoard(int projectId)
    {
        List<Board> boards = await boardRepository.GetAllAsync(projectId);
        return boards.Select(b => b.ToGetDto()).ToList();
    }
}