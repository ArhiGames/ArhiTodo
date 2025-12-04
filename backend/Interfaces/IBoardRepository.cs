using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Post;
using ArhiTodo.Models.DTOs.Put;

namespace ArhiTodo.Interfaces;

public interface IBoardRepository
{
    Task<Board?> CreateAsync(int projectId, BoardPostDto boardPostDto);
    Task<Board?> UpdateAsync(int projectId, BoardPutDto boardPutDto);
    Task<bool> DeleteAsync(int projectId, int boardId);
    Task<List<Board>> GetAllAsync(int projectId);
    Task<Board?> GetAsync(int projectId, int boardId);
}