using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
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

    public async Task<CardListGetDto?> UpdateCardList(int boardId, CardListUpdateDto cardListUpdateDto)
    {
        CardList? updatedCardList = await cardlistRepository.UpdateAsync(cardListUpdateDto.FromUpdateDto(boardId));
        return updatedCardList?.ToGetDto();
    }

    public async Task<bool> DeleteCards(int boardId, int cardListId)
    {
        bool succeeded = await cardlistRepository.DeleteCardsAsync(cardListId);
        return succeeded;
    }

    public async Task<bool> DeleteCardList(int boardId, int cardListId)
    {
        bool succeeded = await cardlistRepository.DeleteAsync(cardListId);
        return succeeded;
    }
}