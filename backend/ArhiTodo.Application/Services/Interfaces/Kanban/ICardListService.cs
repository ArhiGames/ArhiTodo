using ArhiTodo.Application.DTOs.CardList;

namespace ArhiTodo.Application.Services.Interfaces;

public interface ICardListService
{
    Task<CardListGetDto?> CreateCardList(int boardId, CardListCreateDto cardListCreateDto);
    Task<bool> DeleteCardList(int boardId, int cardListId);
}