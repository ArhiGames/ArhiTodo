using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Infrastructure.Persistence.Repositories;

public class LabelRepository : ILabelRepository
{
    private readonly ProjectDataBase _database;

    public LabelRepository(ProjectDataBase database)
    {
        _database = database;
    }

    public async Task<bool> AddLabelToCard(int cardId, int labelId)
    {
        Card? card = await _database.Cards.FirstOrDefaultAsync(c => c.CardId == cardId);
        if (card == null)
        {
            return false;
        }

        Label? label = await _database.Labels.FirstOrDefaultAsync(l => l.LabelId == labelId);
        if (label == null)
        {
            return false;
        }

        CardLabel cardLabel = new()
        {
            CardId = cardId,
            LabelId = labelId
        };
        card.CardLabels.Add(cardLabel);
        await _database.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveLabelFromCard(int cardId, int labelId)
    {
        Card? card = await _database.Cards.Include(card => card.CardLabels).FirstOrDefaultAsync(c => c.CardId == cardId);
        if (card == null)
        {
            return false;
        }

        Label? label = await _database.Labels.FirstOrDefaultAsync(l => l.LabelId == labelId);
        if (label == null)
        {
            return false;
        }

        CardLabel? cardLabelToRemove = card.CardLabels.FirstOrDefault(cl => cl.LabelId == labelId);
        if (cardLabelToRemove == null)
        {
            return false;
        }
        
        card.CardLabels.Remove(cardLabelToRemove);
        await _database.SaveChangesAsync();
        return true;
    }
    
    public async Task<Label?> CreateLabelAsync(int boardId, LabelPostDto labelPostDto)
    {
        Board? board = await _database.Boards.FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null)
        {
            return null;
        }
        
        Label label = new()
        {
            LabelText = labelPostDto.LabelText,
            LabelColor = labelPostDto.LabelColor
        };

        board.Labels.Add(label);
        await _database.SaveChangesAsync();
        return label;
    }

    public async Task<Label?> UpdateLabelAsync(LabelPutDto labelPutDto)
    {
        Label? label = _database.Labels.FirstOrDefault(l => l.LabelId == labelPutDto.LabelId);
        if (label == null)
        {
            return null;
        }

        if (!string.IsNullOrEmpty(labelPutDto.LabelText))
        {
            label.LabelText = labelPutDto.LabelText;
        }

        if (labelPutDto.LabelColor != -1)
        {
            label.LabelColor = labelPutDto.LabelColor;
        }
        
        await _database.SaveChangesAsync();
        return label;
    }

    public async Task<bool> DeleteLabelAsync(int labelId)
    {
        Label? label = await _database.Labels.FirstOrDefaultAsync(l => l.LabelId == labelId);
        if (label == null)
        {
            return false;
        }

        _database.Labels.Remove(label);
        await _database.SaveChangesAsync();
        return true;
    }

    public async Task<List<Label>> GetAllAsync(int boardId)
    {
        Board? board = await _database.Boards
            .Include(b => b.Labels)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null)
        {
            throw new InvalidOperationException();
        }

        return board.Labels.ToList();
    }
}