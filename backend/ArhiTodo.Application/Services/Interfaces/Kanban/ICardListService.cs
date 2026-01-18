using ArhiTodo.Application.DTOs.CardList;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface ICardListService
{
    Task<CardListGetDto?> CreateCardList(int boardId, CardListCreateDto cardListCreateDto);
    Task<CardListGetDto?> UpdateCardList(int boardId, CardListUpdateDto cardListUpdateDto);
    Task<bool> DeleteCards(int boardId, int cardListId);
    Task<bool> DeleteCardList(int boardId, int cardListId);
}