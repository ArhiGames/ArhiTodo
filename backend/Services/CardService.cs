using ArhiTodo.DataBase;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Services;

public class CardService
{
    private readonly ProjectDataBase _projectDataBase;

    public CardService(ProjectDataBase projectDataBase)
    {
        _projectDataBase = projectDataBase;
    }
    
    public async Task<CardList?> PostCardList(int projectId, int boardId, CardListPostDto cardListPostDto)
    {
        Board? board = await _projectDataBase.Boards
            .Include(b => b.CardLists)
            .Include(board => board.Project)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null)
        {
            throw new InvalidOperationException("Not found");
        }

        Project? project = board.Project;
        if (project == null || project.ProjectId != projectId)
        {
            throw new InvalidOperationException("Not found");
        }

        CardList newCardList = new()
        {
            CardListName = cardListPostDto.CardListName
        };
        
        board.CardLists.Add(newCardList);
        await _projectDataBase.SaveChangesAsync();
        return newCardList;
    }

    public async Task<bool> DeleteCardList(int projectId, int boardId, int cardListId)
    {
        Board? board = await _projectDataBase.Boards
            .Include(b => b.CardLists)
            .Include(board => board.Project)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null)
        {
            throw new InvalidOperationException("Not found");
        }

        Project? project = board.Project;
        if (project == null || project.ProjectId != projectId)
        {
            throw new InvalidOperationException("Not found");
        }

        CardList? cardList = board.CardLists.FirstOrDefault(c => c.CardListId == cardListId);
        if (cardList == null)
        {
            throw new InvalidOperationException("Not found");
        }

        board.CardLists.Remove(cardList);
        await _projectDataBase.SaveChangesAsync();
        return true;
    }

    public async Task<Card?> PostCard(int projectId, int boardId, int cardListId, CardPostDto cardPostDto)
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

    public async Task<bool> DeleteCard(int projectId, int boardId, int cardListId, int cardId)
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