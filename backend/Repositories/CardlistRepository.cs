using ArhiTodo.DataBase;
using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Repositories;

public class CardlistRepository : ICardlistRepository
{
    private readonly ProjectDataBase _projectDataBase;

    public CardlistRepository(ProjectDataBase projectDataBase)
    {
        _projectDataBase = projectDataBase;
    }
    
    public async Task<CardList?> CreateAsync(int projectId, int boardId, CardListPostDto cardListPostDto)
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

    public async Task<bool> DeleteAsync(int projectId, int boardId, int cardListId)
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
}