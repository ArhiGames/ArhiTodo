using ArhiTodo.Domain.Entities;

namespace ArhiTodo.Domain.Repositories;

public interface ICardlistRepository
{
    Task<CardList?> CreateAsync(int boardId, CardListPostDto cardListPostDto);
    Task<bool> DeleteAsync(int boardId, int cardListId);
}