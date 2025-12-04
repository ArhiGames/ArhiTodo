using ArhiTodo.DataBase;
using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
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

        Card newCard = new()
        {
            CardName = cardPostDto.CardName
        };
        
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
}