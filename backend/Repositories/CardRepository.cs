using ArhiTodo.Data;
using ArhiTodo.Interfaces;
using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Patch;
using ArhiTodo.Models.DTOs.Post;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Repositories;

public class CardRepository : ICardRepository
{
    private readonly ProjectDataBase _projectDataBase;

    public CardRepository(ProjectDataBase projectDataBase)
    {
        _projectDataBase = projectDataBase;
    }

    public async Task<Card?> CreateAsync(int cardListId, CardPostDto cardPostDto)
    {
        CardList? cardList = _projectDataBase.CardLists.FirstOrDefault(c => c.CardListId == cardListId);
        if (cardList == null)
        {
            return null;
        }

        Card newCard = cardPostDto.FromCardPostDto();
        
        cardList.Cards.Add(newCard);
        await _projectDataBase.SaveChangesAsync();
        return newCard;
    }

    public async Task<bool> DeleteAsync(int cardId)
    {
        Card? card = await _projectDataBase.Cards.FirstOrDefaultAsync(c => c.CardId == cardId);

        if (card == null)
        {
            return false;
        }

        _projectDataBase.Cards.Remove(card);
        await _projectDataBase.SaveChangesAsync();
        return true;
    }

    public async Task<Card?> PatchCardStatus(int cardId, bool isDone)
    {
        Card? card = await _projectDataBase.Cards.FirstOrDefaultAsync(c => c.CardId == cardId);
        if (card == null)
        {
            return null;
        }

        card.IsDone = isDone;
        await _projectDataBase.SaveChangesAsync();
        return card;
    }

    public async Task<Card?> PatchCardName(int cardId, PatchCardNameDto patchCardNameDto)
    {
        Card? card = await _projectDataBase.Cards.FirstOrDefaultAsync(c => c.CardId == cardId);
        if (card == null)
        {
            return null;
        }

        card.CardName = patchCardNameDto.CardName;
        await _projectDataBase.SaveChangesAsync();
        return card;
    }

    public async Task<Card?> PatchCardDescription(int cardId, PatchCardDescriptionDto patchCardDescriptionDto)
    {
        Card? card = await _projectDataBase.Cards
            .FirstOrDefaultAsync(c => c.CardId == cardId);
        if (card == null)
        {
            return null;
        }

        card.CardDescription = patchCardDescriptionDto.CardDescription;
        await _projectDataBase.SaveChangesAsync();
        return card;
    }

    public async Task<DetailedCardGetDto?> GetDetailedCard(int cardId)
    {
        Card? card = await _projectDataBase.Cards
            .Include(c => c.CardLabels)
            .Include(c => c.Checklists)
                .ThenInclude(cl => cl.ChecklistItems)
            .FirstOrDefaultAsync(c => c.CardId == cardId);
        return card?.ToDetailedCardGetDto();
    }
}