using ArhiTodo.DataBase;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using ArhiTodo.Models.DTOs.Get;
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
        await  _projectDataBase.SaveChangesAsync();
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

    // ReSharper disable once InconsistentNaming
    public async Task<ProjectGetDto?> GetAllCardsDTOs(int projectId, int boardId)
    {
        Project? project = await _projectDataBase.Projects
            .Include(p => p.Boards)
                .ThenInclude(b => b.CardLists)
                    .ThenInclude(cl => cl.Cards)
            .Where(p => p.ProjectId == projectId)
            .FirstOrDefaultAsync();
        if (project == null)
        {
            throw new InvalidOperationException("Not found");
        }

        List<Board> boards = project.Boards
            .Where(b => b.BoardId == boardId)
            .ToList();

        ProjectGetDto projectGetDto = new ProjectGetDto
        {
            ProjectId = project.ProjectId,
            ProjectName = project.ProjectName,
            Boards = boards.Select(b => new BoardGetDto
            {
                BoardId = b.BoardId,
                BoardName = b.BoardName,
                CardLists = b.CardLists.Select(cl => new CardListGetDto
                {
                    CardListId = cl.CardListId,
                    CardListName = cl.CardListName,
                    Cards = cl.Cards.Select(c => new CardGetDto
                    {
                        CardId = c.CardId,
                        CardName = c.CardName
                    }).ToList()
                }).ToList()
            }).ToList()
        };
        
        return projectGetDto;
    }
}