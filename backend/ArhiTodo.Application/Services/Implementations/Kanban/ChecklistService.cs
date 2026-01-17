using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ChecklistService(IChecklistRepository checklistRepository) : IChecklistService
{
    public async Task<ChecklistGetDto?> CreateChecklist(int cardId, ChecklistCreateDto checklistCreateDto)
    {
        Checklist? checklist = await checklistRepository.CreateChecklistOnCard(checklistCreateDto.FromCreateDto(cardId));
        return checklist?.ToGetDto();
    }

    public async Task<bool> DeleteChecklist(int checklistId)
    {
        bool succeeded = await checklistRepository.DeleteChecklistFromCard(checklistId);
        return succeeded;
    }

    public async Task<ChecklistItemGetDto?> CreateChecklistItem(int checklistId, ChecklistItemCreateDto checklistItemCreateDto)
    {
        ChecklistItem? createdChecklistItem = await checklistRepository.AddChecklistItemToChecklist(checklistItemCreateDto.FromCreateDto(checklistId));
        return createdChecklistItem?.ToGetDto();
    }

    public async Task<ChecklistItemGetDto?> UpdateChecklistItem(int checklistId, ChecklistItemUpdateDto checklistItemUpdateDto)
    {
        ChecklistItem? updatedChecklistItem =
            await checklistRepository.UpdateChecklistItem(checklistItemUpdateDto.FromUpdateDto(checklistId));
        return updatedChecklistItem?.ToGetDto();
    }

    public async Task<bool> DeleteChecklistItem(int checklistItemId)
    {
        bool succeeded = await checklistRepository.RemoveChecklistItemFromChecklist(checklistItemId);
        return succeeded;
    }

    public async Task<ChecklistItemGetDto?> PatchChecklistItemState(int checklistItemId, bool newState)
    {
        ChecklistItem? checklistItem = await checklistRepository.PatchChecklistItemDoneState(checklistItemId, newState);
        return checklistItem?.ToGetDto();
    }
}