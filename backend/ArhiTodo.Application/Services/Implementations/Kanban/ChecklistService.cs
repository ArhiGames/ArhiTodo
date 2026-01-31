using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ChecklistService(IChecklistNotificationService checklistNotificationService, IChecklistRepository checklistRepository) : IChecklistService
{
    public async Task<ChecklistGetDto?> CreateChecklist(int boardId, int cardId, ChecklistCreateDto checklistCreateDto)
    {
        Checklist? checklist = await checklistRepository.CreateChecklistOnCard(checklistCreateDto.FromCreateDto(cardId));
        if (checklist == null) return null;

        ChecklistGetDto checklistGetDto = checklist.ToGetDto();
        checklistNotificationService.CreateChecklist(boardId, cardId, checklistGetDto);
        return checklistGetDto;
    }

    public async Task<ChecklistGetDto?> UpdateChecklist(int boardId, int cardId, ChecklistUpdateDto checklistUpdateDto)
    {
        Checklist? checklist = await checklistRepository.UpdateChecklist(checklistUpdateDto.FromUpdateDto(cardId));
        if (checklist == null) return null;

        ChecklistGetDto checklistGetDto = checklist.ToGetDto();
        checklistNotificationService.UpdateChecklist(boardId, cardId, checklistGetDto);
        return checklistGetDto;
    }

    public async Task<bool> DeleteChecklist(int boardId, int checklistId)
    {
        bool succeeded = await checklistRepository.DeleteChecklistFromCard(checklistId);
        if (succeeded)
        {
            checklistNotificationService.DeleteChecklist(boardId, checklistId);
        }
        return succeeded;
    }

    public async Task<ChecklistItemGetDto?> CreateChecklistItem(int boardId, int checklistId, ChecklistItemCreateDto checklistItemCreateDto)
    {
        ChecklistItem? createdChecklistItem = await checklistRepository.AddChecklistItemToChecklist(checklistItemCreateDto.FromCreateDto(checklistId));
        if (createdChecklistItem == null) return null;

        ChecklistItemGetDto checklistItemGetDto = createdChecklistItem.ToGetDto();
        checklistNotificationService.CreateChecklistItemOnChecklist(boardId, checklistId, checklistItemGetDto);
        return checklistItemGetDto;
    }

    public async Task<ChecklistItemGetDto?> UpdateChecklistItem(int boardId, int checklistId, ChecklistItemUpdateDto checklistItemUpdateDto)
    {
        ChecklistItem? updatedChecklistItem =
            await checklistRepository.UpdateChecklistItem(checklistItemUpdateDto.FromUpdateDto(checklistId));
        if (updatedChecklistItem == null) return null;

        ChecklistItemGetDto checklistItemGetDto = updatedChecklistItem.ToGetDto();
        checklistNotificationService.UpdateChecklistItem(boardId, checklistId, checklistItemGetDto);
        return checklistItemGetDto;
    }

    public async Task<bool> DeleteChecklistItem(int boardId, int checklistId, int checklistItemId)
    {
        bool succeeded = await checklistRepository.RemoveChecklistItemFromChecklist(checklistItemId);
        if (succeeded)
        {
            checklistNotificationService.DeleteChecklistItemFromChecklist(boardId, checklistId, checklistItemId);
        }
        return succeeded;
    }

    public async Task<ChecklistItemGetDto?> PatchChecklistItemState(int boardId, int checklistItemId, bool newState)
    {
        ChecklistItem? checklistItem = await checklistRepository.PatchChecklistItemDoneState(checklistItemId, newState);
        if (checklistItem == null) return null;

        ChecklistItemGetDto checklistItemGetDto = checklistItem.ToGetDto();
        checklistNotificationService.PatchChecklistItemDoneState(boardId, checklistItemId, newState);
        return checklistItemGetDto;
    }
}