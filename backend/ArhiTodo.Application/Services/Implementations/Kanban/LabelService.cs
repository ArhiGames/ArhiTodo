using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Authorization;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class LabelService(IBoardRepository boardRepository, ICardRepository cardRepository, 
    ILabelNotificationService labelNotificationService, IUnitOfWork unitOfWork, ICardAuthorizer cardAuthorizer, ILabelAuthorizer labelAuthorizer) : ILabelService
{
    public async Task<Result<LabelGetDto>> CreateLabel(int boardId, LabelCreateDto labelCreateDto)
    {
        bool hasCreateLabelPermission = await labelAuthorizer.HasCreateLabelPermission(boardId);
        if (!hasCreateLabelPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId, true);
        if (board is null) return Errors.NotFound;

        List<Label> sortedLabels = board.Labels.OrderBy(l => l.Position).ToList();
        
        Result<Label> createdLabel = board.AddLabel(labelCreateDto.LabelText, 
            labelCreateDto.LabelColor, sortedLabels.Count > 0 ? sortedLabels.Last().Position : null);
        if (!createdLabel.IsSuccess) return createdLabel.Error!;
        
        await unitOfWork.SaveChangesAsync();

        LabelGetDto labelGetDto = createdLabel.Value!.ToGetDto();
        labelNotificationService.CreateLabel(boardId, labelGetDto);
        return labelGetDto;
    }

    public async Task<Result<LabelGetDto>> UpdateLabel(int boardId, LabelUpdateDto labelUpdateDto)
    {
        bool hasEditLabelPermission = await labelAuthorizer.HasEditLabelPermission(labelUpdateDto.LabelId);
        if (!hasEditLabelPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId, true);
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

    public async Task<Result> DeleteLabel(int boardId, int labelId)
    {
        bool hasDeleteLabelPermission = await labelAuthorizer.HasDeleteLabelPermission(labelId);
        if (!hasDeleteLabelPermission) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId, true);
        if (board == null) return Errors.NotFound;
        
        Result deleteLabelResult = board.DeleteLabel(labelId);
        await unitOfWork.SaveChangesAsync();
        
        if (deleteLabelResult.IsSuccess)
        {
            labelNotificationService.DeleteLabel(boardId, labelId);
        }
        return deleteLabelResult;
    }

    public async Task<Result> AddLabelToCard(int boardId, int cardId, int labelId)
    {
        bool hasEditCardPermissions = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasEditCardPermissions) return Errors.Forbidden;
        
        Board? board = await boardRepository.GetAsync(boardId, true);
        if (board is null) return Errors.NotFound;

        Label? label = board.Labels.FirstOrDefault(l => l.LabelId == labelId);
        if (label is null) return Errors.NotFound;

        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;

        card.AddLabel(label);
        await unitOfWork.SaveChangesAsync();
        
        labelNotificationService.AddLabelToCard(boardId, cardId, labelId);
        
        return Result.Success();
    }

    public async Task<Result> RemoveLabelFromCard(int boardId, int cardId, int labelId)
    {
        bool hasEditCardPermissions = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasEditCardPermissions) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;
        
        Result removeLabelResult = card.RemoveLabel(labelId);
        await unitOfWork.SaveChangesAsync();
        
        if (removeLabelResult.IsSuccess)
        {
            labelNotificationService.RemoveLabelFromCard(boardId, cardId, labelId);
        }
        return removeLabelResult;
    }
}