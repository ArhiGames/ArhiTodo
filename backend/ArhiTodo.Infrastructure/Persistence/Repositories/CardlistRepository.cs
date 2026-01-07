using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class CardlistRepository : ICardlistRepository
{
    private readonly ProjectDataBase _projectDataBase;

    public CardlistRepository(ProjectDataBase projectDataBase)
    {
        _projectDataBase = projectDataBase;
    }
    
    public async Task<CardList?> CreateAsync(int boardId, CardListPostDto cardListPostDto)
    {
        Board? board = await _projectDataBase.Boards
            .Include(b => b.CardLists)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null)
        {
            return null;
        }

        CardList newCardList = cardListPostDto.FromCardListPostDto();
        
        board.CardLists.Add(newCardList);
        await _projectDataBase.SaveChangesAsync();
        return newCardList;
    }

    public async Task<bool> DeleteAsync(int boardId, int cardListId)
    {
        Board? board = await _projectDataBase.Boards
            .Include(b => b.CardLists)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null)
        {
            return false;
        }

        CardList? cardList = board.CardLists.FirstOrDefault(c => c.CardListId == cardListId);
        if (cardList == null)
        {
            return false;
        }

        bool removed = board.CardLists.Remove(cardList);
        await _projectDataBase.SaveChangesAsync();
        return removed;
    }
}