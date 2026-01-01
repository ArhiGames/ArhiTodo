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

    public async Task<Card?> CreateAsync(int projectId, int boardId, int cardListId, CardPostDto cardPostDto)
    {
        Project? project = await _projectDataBase.Projects
            .Where(p => p.ProjectId == projectId)
            .Include(p => p.Boards)
                .ThenInclude(b => b.CardLists)
                    .ThenInclude(cl => cl.Cards)
            .FirstOrDefaultAsync();
        if (project == null)
        {
            throw new InvalidOperationException("Not found");
        }
        
        Board? board = project.Boards.FirstOrDefault(b => b.BoardId == boardId);
        if (board == null)
        {
            throw new InvalidOperationException("Not found");
        }
        
        CardList? cardList = board.CardLists.FirstOrDefault(c => c.CardListId == cardListId);
        if (cardList == null)
        {
            throw new InvalidOperationException("Not found");
        }

        Card newCard = cardPostDto.FromCardPostDto();
        
        cardList.Cards.Add(newCard);
        await _projectDataBase.SaveChangesAsync();
        return newCard;
    }

    public async Task<bool> DeleteAsync(int projectId, int boardId, int cardListId, int cardId)
    {
        Project? project = await _projectDataBase.Projects
            .Where(p => p.ProjectId == projectId)
            .Include(p => p.Boards)
                .ThenInclude(b => b.CardLists)
                    .ThenInclude(cl => cl.Cards)
            .FirstOrDefaultAsync();
        if (project == null) throw new InvalidOperationException("Not found");
        
        Board? board = project.Boards.FirstOrDefault(b => b.BoardId == boardId);
        if (board == null) throw new InvalidOperationException("Not found");
        
        CardList? cardList = board.CardLists.FirstOrDefault(c => c.CardListId == cardListId);
        if (cardList == null) throw new InvalidOperationException("Not found");
        
        Card? card = cardList.Cards.FirstOrDefault(c => c.CardId == cardId);
        if (card == null) throw new InvalidOperationException("Not found");
        
        cardList.Cards.Remove(card);
        await _projectDataBase.SaveChangesAsync();
        return true;
    }

    public async Task<Card?> PatchCardDescription(int cardId, PatchCardDescriptionDto patchCardDescriptionDto)
    {
        Card? card = await _projectDataBase.Cards.FirstOrDefaultAsync(c => c.CardId == cardId);
        if (card == null)
        {
            throw new InvalidOperationException();
        }

        card.CardDescription = patchCardDescriptionDto.CardDescription;
        await _projectDataBase.SaveChangesAsync();
        return card;
    }

    public async Task<DetailedCardGetDto?> GetDetailedCard(int cardId)
    {
        Card? card = await _projectDataBase.Cards
            .Include(c => c.CardLabels)
            .Where(c => c.CardId == cardId)
                .Include(c => c.CardList)
                    .ThenInclude(cl => cl.Board)
                        .ThenInclude(b => b.Project)
            .FirstOrDefaultAsync();
        if (card == null)
        {
            throw new InvalidOperationException("Not found!");
        }

        return card.ToDetailedCardGetDto();
    }
}