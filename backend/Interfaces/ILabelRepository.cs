using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Post;
using ArhiTodo.Models.DTOs.Put;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Interfaces;

public interface ILabelRepository
{
    Task<bool> AddLabelToCard(int cardId, int labelId);
    Task<bool> RemoveLabelFromCard(int cardId, int labelId);
    Task<Label?> CreateLabelAsync(int projectId, int boardId, LabelPostDto labelPostDto);
    Task<Label?> UpdateLabelAsync(int projectId, int boardId, LabelPutDto labelPutDto);
    Task<bool> DeleteLabelAsync(int labelId);
    Task<List<Label>> GetAllAsync(int boardId);
}
