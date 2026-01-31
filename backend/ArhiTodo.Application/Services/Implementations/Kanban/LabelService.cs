using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class LabelService(ILabelNotificationService labelNotificationService, ILabelRepository labelRepository) : ILabelService
{
    public async Task<LabelGetDto?> CreateLabel(int boardId, LabelCreateDto labelCreateDto)
    {
        Label? label = await labelRepository.CreateLabelAsync(labelCreateDto.FromCreateDto(boardId));
        if (label == null) return null;

        LabelGetDto labelGetDto = label.ToGetDto();
        labelNotificationService.CreateLabel(boardId, labelGetDto);
        return labelGetDto;
    }

    public async Task<LabelGetDto?> UpdateLabel(int boardId, LabelUpdateDto labelUpdateDto)
    {
        Label? label = await labelRepository.UpdateLabelAsync(labelUpdateDto.LabelId, labelUpdateDto.LabelText, labelUpdateDto.LabelColor);
        if (label == null) return null;

        LabelGetDto labelGetDto = label.ToGetDto();
        labelNotificationService.UpdateLabel(boardId, labelGetDto);
        return labelGetDto;
    }

    public async Task<bool> DeleteLabel(int boardId, int labelId)
    {
        bool succeeded = await labelRepository.DeleteLabelAsync(labelId);
        if (succeeded)
        {
            labelNotificationService.DeleteLabel(boardId, labelId);
        }
        return succeeded;
    }

    public async Task<List<LabelGetDto>> GetEveryLabel(int boardId)
    {
        List<Label> labels = await labelRepository.GetAllAsync(boardId);
        return labels.Select(l => l.ToGetDto()).ToList();
    }

    public async Task<bool> AddLabelToCard(int boardId, int cardId, int labelId)
    {
        CardLabel? cardLabel = await labelRepository.AddLabelToCard(cardId, labelId);
        if (cardLabel == null) return false;
        
        labelNotificationService.AddLabelToCard(boardId, cardId, labelId);
        
        return true;
    }

    public async Task<bool> RemoveLabelFromCard(int boardId, int cardId, int labelId)
    {
        bool succeeded = await labelRepository.RemoveLabelFromCard(cardId, labelId);

        if (succeeded)
        {
            labelNotificationService.RemoveLabelFromCard(boardId, cardId, labelId);
        }
        
        return succeeded;
    }
}