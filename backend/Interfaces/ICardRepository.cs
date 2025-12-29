using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Post;

namespace ArhiTodo.Interfaces;

public interface ICardRepository
{
    Task<Card?> CreateAsync(int projectId, int boardId, int cardListId, CardPostDto cardPostDto);
    Task<bool> DeleteAsync(int projectId, int boardId, int cardListId, int cardId);
    Task<DetailedCardGetDto?> GetDetailedCard(int cardId);
}