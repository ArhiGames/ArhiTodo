using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class LabelService(IBoardRepository boardRepository, ICardRepository cardRepository, 
    ILabelNotificationService labelNotificationService, IUnitOfWork unitOfWork) : ILabelService
{
    public async Task<LabelGetDto?> CreateLabel(int boardId, LabelCreateDto labelCreateDto)
    {
        Board? board = await boardRepository.GetAsync(boardId, false, false);
        if (board == null) return null;
        
        Label createdLabel = board.AddLabel(labelCreateDto.LabelText, labelCreateDto.LabelColor);
        await unitOfWork.SaveChangesAsync();

        LabelGetDto labelGetDto = createdLabel.ToGetDto();
        labelNotificationService.CreateLabel(boardId, labelGetDto);
        return labelGetDto;
    }

    public async Task<LabelGetDto?> UpdateLabel(int boardId, LabelUpdateDto labelUpdateDto)
    {
        Board? board = await boardRepository.GetAsync(boardId, false, false);
        if (board == null) return null;

        Label? label = board.Labels.FirstOrDefault(l => l.LabelId == labelUpdateDto.LabelId);
        if (label == null) return null;

        label.RenameLabel(labelUpdateDto.LabelText);
        label.ChangeLabelColor(labelUpdateDto.LabelColor);
        await unitOfWork.SaveChangesAsync();
        
        LabelGetDto labelGetDto = label.ToGetDto();
        labelNotificationService.UpdateLabel(boardId, labelGetDto);
        return labelGetDto;
    }

    public async Task<bool> DeleteLabel(int boardId, int labelId)
    {
        Board? board = await boardRepository.GetAsync(boardId, false, false);
        if (board == null) return false;
        
        bool succeeded = board.RemoveLabel(labelId);
        await unitOfWork.SaveChangesAsync();
        
        if (succeeded)
        {
            labelNotificationService.DeleteLabel(boardId, labelId);
        }
        return succeeded;
    }

    public async Task<List<LabelGetDto>?> GetEveryLabel(int boardId)
    {
        Board? board = await boardRepository.GetAsync(boardId, false, false);
        return board?.Labels.Select(l => l.ToGetDto()).ToList();
    }

    public async Task<bool> AddLabelToCard(int boardId, int cardId, int labelId)
    {
        Board? board = await boardRepository.GetAsync(boardId, false, false);
        if (board == null) return false;

        Label? label = board.Labels.FirstOrDefault(l => l.LabelId == labelId);
        if (label == null) return false;

        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return false;

        card.AddLabel(label);
        await unitOfWork.SaveChangesAsync();
        
        labelNotificationService.AddLabelToCard(boardId, cardId, labelId);
        
        return true;
    }

    public async Task<bool> RemoveLabelFromCard(int boardId, int cardId, int labelId)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return false;
        
        bool succeeded = card.RemoveLabel(labelId);
        await unitOfWork.SaveChangesAsync();
        
        if (succeeded)
        {
            labelNotificationService.RemoveLabelFromCard(boardId, cardId, labelId);
        }
        return succeeded;
    }
}