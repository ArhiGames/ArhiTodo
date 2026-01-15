using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class CardListService(ICardlistRepository cardlistRepository) : ICardListService
{
    public async Task<CardListGetDto?> CreateCardList(int boardId, CardListCreateDto cardListCreateDto)
    {
        CardList? createdCardList = await cardlistRepository.CreateAsync(cardListCreateDto.FromCreateDto(boardId));
        return createdCardList?.ToGetDto();
    }

    public async Task<bool> DeleteCardList(int boardId, int cardListId)
    {
        bool succeeded = await cardlistRepository.DeleteAsync(cardListId);
        return succeeded;
    }
}