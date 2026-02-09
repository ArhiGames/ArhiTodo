using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class LabelService(IBoardRepository boardRepository, ICardRepository cardRepository, 
    ILabelNotificationService labelNotificationService, IUnitOfWork unitOfWork) : ILabelService
{
    public async Task<Result<LabelGetDto>> CreateLabel(int boardId, LabelCreateDto labelCreateDto)
    {
        Board? board = await boardRepository.GetAsync(boardId, false);
        if (board is null) return Errors.NotFound;
        
        Result<Label> createdLabel = board.AddLabel(labelCreateDto.LabelText, labelCreateDto.LabelColor);
        if (!createdLabel.IsSuccess) return createdLabel.Error!;
        
        await unitOfWork.SaveChangesAsync();

        LabelGetDto labelGetDto = createdLabel.Value!.ToGetDto();
        labelNotificationService.CreateLabel(boardId, labelGetDto);
        return labelGetDto;
    }

    public async Task<Result<LabelGetDto>> UpdateLabel(int boardId, LabelUpdateDto labelUpdateDto)
    {
        Board? board = await boardRepository.GetAsync(boardId, false);
        if (board is null) return Errors.NotFound;

        Label? label = board.Labels.FirstOrDefault(l => l.LabelId == labelUpdateDto.LabelId);
        if (label is null) return Errors.NotFound;

        Result renameLabelResult = label.RenameLabel(labelUpdateDto.LabelText);
        if (!renameLabelResult.IsSuccess) return renameLabelResult.Error!;
        
        label.ChangeLabelColor(labelUpdateDto.LabelColor);
        
        await unitOfWork.SaveChangesAsync();
        
        LabelGetDto labelGetDto = label.ToGetDto();
        labelNotificationService.UpdateLabel(boardId, labelGetDto);
        return labelGetDto;
    }

    public async Task<bool> DeleteLabel(int boardId, int labelId)
    {
        Board? board = await boardRepository.GetAsync(boardId, false);
        if (board == null) return false;
        
        Result deleteLabelResult = board.DeleteLabel(labelId);
        await unitOfWork.SaveChangesAsync();
        
        if (deleteLabelResult.IsSuccess)
        {
            labelNotificationService.DeleteLabel(boardId, labelId);
        }
        return deleteLabelResult.IsSuccess;
    }

    public async Task<List<LabelGetDto>?> GetEveryLabel(int boardId)
    {
        Board? board = await boardRepository.GetAsync(boardId, false);
        return board?.Labels.Select(l => l.ToGetDto()).ToList();
    }

    public async Task<bool> AddLabelToCard(int boardId, int cardId, int labelId)
    {
        Board? board = await boardRepository.GetAsync(boardId, false);
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
        
        Result removeLabelResult = card.RemoveLabel(labelId);
        await unitOfWork.SaveChangesAsync();
        
        if (removeLabelResult.IsSuccess)
        {
            labelNotificationService.RemoveLabelFromCard(boardId, cardId, labelId);
        }
        return removeLabelResult.IsSuccess;
    }
}