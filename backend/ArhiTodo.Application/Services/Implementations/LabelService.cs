using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces;
using ArhiTodo.Domain.Entities;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations;

public class LabelService(ILabelRepository labelRepository) : ILabelService
{
    public async Task<LabelGetDto?> CreateLabel(int boardId, LabelCreateDto labelCreateDto)
    {
        Label? label = await labelRepository.CreateLabelAsync(labelCreateDto.FromCreateDto(boardId));
        return label?.ToGetDto();
    }

    public async Task<bool> UpdateLabel(LabelUpdateDto labelUpdateDto)
    {
        bool succeeded = await labelRepository.UpdateLabelAsync(labelUpdateDto.LabelId, labelUpdateDto.LabelText, labelUpdateDto.LabelColor);
        return succeeded;
    }

    public async Task<bool> DeleteLabel(int labelId)
    {
        bool succeeded = await labelRepository.DeleteLabelAsync(labelId);
        return succeeded;
    }

    public async Task<List<LabelGetDto>> GetEveryLabel(int boardId)
    {
        List<Label> labels = await labelRepository.GetAllAsync(boardId);
        return labels.Select(l => l.ToGetDto()).ToList();
    }

    public async Task<bool> AddLabelToCard(int cardId, int labelId)
    {
        CardLabel? cardLabel = await labelRepository.AddLabelToCard(cardId, labelId);
        return cardLabel != null;
    }

    public async Task<bool> RemoveLabelFromCard(int cardId, int labelId)
    {
        bool succeeded = await labelRepository.RemoveLabelFromCard(cardId, labelId);
        return succeeded;
    }
}