using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Post;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Interfaces;

public interface ILabelRepository
{
    Task<bool> AddLabelToCard(int cardId, int labelId);
    Task<bool> RemoveLabelFromCard(int cardId, int labelId);
    Task<Label?> CreateLabelAsync(int projectId, int boardId, [FromBody] LabelPostDto labelPostDto);
    Task<List<Label>> GetAllAsync(int boardId);
}
