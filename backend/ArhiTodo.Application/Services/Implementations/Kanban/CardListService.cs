using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class CardListService(ICardListNotificationService cardListNotificationService, ICardlistRepository cardlistRepository) : ICardListService
{
    public async Task<CardListGetDto?> CreateCardList(int boardId, CardListCreateDto cardListCreateDto)
    {
        CardList? createdCardList = await cardlistRepository.CreateAsync(cardListCreateDto.FromCreateDto(boardId));
        if (createdCardList == null) return null;

        CardListGetDto cardListGetDto = createdCardList.ToGetDto();
        cardListNotificationService.CreateCardList(boardId, cardListGetDto);
        return cardListGetDto;
    }

    public async Task<CardListGetDto?> UpdateCardList(int boardId, CardListUpdateDto cardListUpdateDto)
    {
        CardList? updatedCardList = await cardlistRepository.UpdateAsync(cardListUpdateDto.FromUpdateDto(boardId));
        if (updatedCardList == null) return null;

        CardListGetDto cardListGetDto = updatedCardList.ToGetDto();
        cardListNotificationService.UpdateCardList(boardId, cardListGetDto);
        return cardListGetDto;
    }

    public async Task<bool> DeleteCards(int boardId, int cardListId)
    {
        bool succeeded = await cardlistRepository.DeleteCardsAsync(cardListId);
        if (succeeded)
        {
            cardListNotificationService.DeleteCardsFromCardList(boardId, cardListId);
        }
        return succeeded;
    }

    public async Task<bool> DeleteCardList(int boardId, int cardListId)
    {
        bool succeeded = await cardlistRepository.DeleteAsync(cardListId);
        if (succeeded)
        {
            cardListNotificationService.DeleteCardList(boardId, cardListId);
        }
        return succeeded;
    }
}