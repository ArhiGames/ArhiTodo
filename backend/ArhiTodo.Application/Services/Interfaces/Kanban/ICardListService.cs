using ArhiTodo.Application.DTOs.CardList;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface ICardListService
{
    Task<CardListGetDto?> CreateCardList(int boardId, CardListCreateDto cardListCreateDto);
    Task<bool> DeleteCardList(int boardId, int cardListId);
}