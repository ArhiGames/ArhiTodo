using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Post;

namespace ArhiTodo.Interfaces;

public interface ICardlistRepository
{
    Task<CardList?> CreateAsync(int projectId, int boardId, CardListPostDto cardListPostDto);
    Task<bool> DeleteAsync(int projectId, int boardId, int cardListId);
}