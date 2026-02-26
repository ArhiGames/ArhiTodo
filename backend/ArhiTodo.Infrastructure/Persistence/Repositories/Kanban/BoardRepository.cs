using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;

public class BoardRepository(ProjectDataBase database) : IBoardRepository
{
    public async Task RemoveAssignedCardUsers(int boardId, List<Guid> userIds)
    {
        await database.AssignedCardUsers
            .Where(acu => acu.Card.CardList.BoardId == boardId && userIds.Contains(acu.UserId))
            .ExecuteDeleteAsync();
    }

    public async Task<BoardGetDto?> GetReadModelAsync(int boardId)
    {
        BoardGetDto? boardGetDto = await database.Boards
            .AsNoTracking()
            .Where(b => b.BoardId == boardId)
            .Select(b => new BoardGetDto
            {
                BoardId = b.BoardId,
                Position = b.Position,
                BoardName = b.BoardName,
                OwnedByUserId = b.OwnerId,
                CardLists = b.CardLists.Select(cl => new CardListGetDto
                {
                    CardListId = cl.CardListId,
                    Position = cl.Position,
                    CardListName = cl.CardListName,
                    Cards = cl.Cards.Select(c => new CardGetDto
                    {
                        CardId = c.CardId,
                        CardName = c.CardName,
                        CardDescription = c.CardDescription,
                        Position = c.Position,
                        CardUrgencyLevel = c.CardUrgencyLevel,
                        AssignedUserIds = c.AssignedUsers.Select(asu => asu.UserId).ToList(),
                        IsDone = c.IsDone,
                        Checklists = c.Checklists.Select(cel => new ChecklistGetDto
                        {
                            ChecklistId = cel.ChecklistId,
                            Position = cel.Position,
                            ChecklistName = cel.ChecklistName,
                            ChecklistItems = cel.ChecklistItems.Select(ci => new ChecklistItemGetDto
                            {
                                ChecklistItemId = ci.ChecklistItemId,
                                Position = ci.Position,
                                ChecklistItemName = ci.ChecklistItemName,
                                IsDone = ci.IsDone
                            }).ToList()
                        }).ToList(),
                        LabelIds = c.Labels.Select(l => l.LabelId).ToList()
                    }).ToList()
                }).ToList(),
                Labels = b.Labels.Select(l => new LabelGetDto
                {
                    LabelId = l.LabelId,
                    Position = l.Position,
                    LabelText = l.LabelText,
                    LabelColor = l.LabelColor
                }).ToList()
            })
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        return boardGetDto;
    }

    public async Task<Board?> GetAsync(int boardId, bool includeLabels = false, bool includeCardLists = false, 
        bool includeCards = false)
    {
        IQueryable<Board> boardQuery = database.Boards
            .Include(b => b.BoardUserClaims)
            .Include(b => b.Owner);
        if (includeLabels)
        {
            boardQuery = boardQuery.Include(b => b.Labels);
        }

        if (includeCardLists)
        {
            boardQuery = boardQuery.Include(b => b.CardLists);
            if (includeCards)
            {
                boardQuery = boardQuery.Include(b => b.CardLists).ThenInclude(cl => cl.Cards);
            }
        }

        return await boardQuery.FirstOrDefaultAsync(b => b.BoardId == boardId);
    }

    public async Task<List<Board>> GetAllAsync(Guid userId, int projectId)
    {
        List<Board> boards = await database.Boards
            .Where(b => b.ProjectId == projectId &&
                        (b.Project.ProjectManagers.Any(pm => pm.UserId == userId) ||
                         b.BoardUserClaims.Any(buc =>
                             buc.UserId == userId && buc.Type == BoardClaimTypes.ViewBoard && buc.Value)))
            .ToListAsync();

        return boards;
    }
}