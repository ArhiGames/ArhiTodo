using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ChecklistService(ICardRepository cardRepository, IChecklistNotificationService checklistNotificationService,
    IUnitOfWork unitOfWork) : IChecklistService
{
    public async Task<ChecklistGetDto?> CreateChecklist(int boardId, int cardId, ChecklistCreateDto checklistCreateDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return null;

        Checklist checklist = new(cardId, checklistCreateDto.ChecklistName);
        card.AddChecklist(checklist);
        await unitOfWork.SaveChangesAsync();

        ChecklistGetDto checklistGetDto = checklist.ToGetDto();
        checklistNotificationService.CreateChecklist(boardId, cardId, checklistGetDto);
        return checklistGetDto;
    }

    public async Task<ChecklistGetDto?> UpdateChecklist(int boardId, int cardId, ChecklistUpdateDto checklistUpdateDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return null;

        Checklist? checklist = card.Checklists.FirstOrDefault(cl => cl.ChecklistId == checklistUpdateDto.ChecklistId);
        if (checklist == null) return null;
        
        checklist.RenameChecklist(checklistUpdateDto.ChecklistName);
        await unitOfWork.SaveChangesAsync();
        
        ChecklistGetDto checklistGetDto = checklist.ToGetDto();
        checklistNotificationService.UpdateChecklist(boardId, cardId, checklistGetDto);
        return checklistGetDto;
    }

    public async Task<bool> DeleteChecklist(int boardId, int cardId, int checklistId)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return false;

        Result removeChecklistResult = card.RemoveChecklist(checklistId);
        if (removeChecklistResult.IsSuccess)
        {
            checklistNotificationService.DeleteChecklist(boardId, checklistId);
            await unitOfWork.SaveChangesAsync();
        }
        return removeChecklistResult.IsSuccess;
    }

    public async Task<ChecklistItemGetDto?> CreateChecklistItem(int boardId, int cardId, int checklistId, 
        ChecklistItemCreateDto checklistItemCreateDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return null;

        Checklist? checklist = card.Checklists.FirstOrDefault(c => c.ChecklistId == checklistId);
        if (checklist == null) return null;
        
        ChecklistItem createdChecklistItem = checklist.AddChecklistItem(checklistItemCreateDto.ChecklistItemName);
        await unitOfWork.SaveChangesAsync();

        ChecklistItemGetDto checklistItemGetDto = createdChecklistItem.ToGetDto();
        checklistNotificationService.CreateChecklistItemOnChecklist(boardId, checklistId, checklistItemGetDto);
        return checklistItemGetDto;
    }
    
    public async Task<bool> DeleteChecklistItem(int boardId, int cardId, int checklistId, int checklistItemId)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return false;
        
        Checklist? checklist = card.Checklists.FirstOrDefault(c => c.ChecklistId == checklistId);
        if (checklist == null) return false;

        Result removeChecklistItemResult = checklist.RemoveChecklistItem(checklistItemId);
        if (removeChecklistItemResult.IsSuccess)
        {
            await unitOfWork.SaveChangesAsync();
            checklistNotificationService.DeleteChecklistItemFromChecklist(boardId, checklistId, checklistItemId);
        }
        return removeChecklistItemResult.IsSuccess;
    }

    public async Task<ChecklistItemGetDto?> UpdateChecklistItem(int boardId, int cardId, int checklistId, 
        ChecklistItemUpdateDto checklistItemUpdateDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return null;
        
        Checklist? checklist = card.Checklists.FirstOrDefault(c => c.ChecklistId == checklistId);
        if (checklist == null) return null;
        ChecklistItem? checklistItem = checklist.ChecklistItems.FirstOrDefault(ci => ci.ChecklistItemId == checklistItemUpdateDto.ChecklistItemId);
        if (checklistItem == null) return null;
        
        checklistItem.RenameChecklistItem(checklistItemUpdateDto.ChecklistItemName);
        await unitOfWork.SaveChangesAsync();

        ChecklistItemGetDto checklistItemGetDto = checklistItem.ToGetDto();
        checklistNotificationService.UpdateChecklistItem(boardId, checklistId, checklistItemGetDto);
        return checklistItemGetDto;
    }

    public async Task<ChecklistItemGetDto?> PatchChecklistItemState(int boardId, int cardId, int checklistItemId, bool newState)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return null;

        ChecklistItem? updateChecklistItem = card.UpdateChecklistItemState(checklistItemId, newState);
        if (updateChecklistItem == null) return null;

        await unitOfWork.SaveChangesAsync();
        
        ChecklistItemGetDto checklistItemGetDto = updateChecklistItem.ToGetDto();
        checklistNotificationService.PatchChecklistItemDoneState(boardId, checklistItemId, newState);
        return checklistItemGetDto;
    }
}