using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Application.Mappers;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;

namespace ArhiTodo.Application.Services.Implementations.Kanban;

public class ChecklistService(ICardRepository cardRepository, IChecklistNotificationService checklistNotificationService,
    IUnitOfWork unitOfWork) : IChecklistService
{
    public async Task<Result<ChecklistGetDto>> CreateChecklist(int boardId, int cardId, ChecklistCreateDto checklistCreateDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;

        Result<Checklist> createChecklistResult = Checklist.Create(cardId, checklistCreateDto.ChecklistName);
        if (!createChecklistResult.IsSuccess) return createChecklistResult.Error!;
        
        card.AddChecklist(createChecklistResult.Value!);
        await unitOfWork.SaveChangesAsync();

        ChecklistGetDto checklistGetDto = createChecklistResult.Value!.ToGetDto();
        checklistNotificationService.CreateChecklist(boardId, cardId, checklistGetDto);
        return checklistGetDto;
    }

    public async Task<Result<ChecklistGetDto>> UpdateChecklist(int boardId, int cardId, ChecklistUpdateDto checklistUpdateDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;

        Checklist? checklist = card.Checklists.FirstOrDefault(cl => cl.ChecklistId == checklistUpdateDto.ChecklistId);
        if (checklist is null) return Errors.NotFound;
        
        Result renameChecklistResult = checklist.RenameChecklist(checklistUpdateDto.ChecklistName);
        if (!renameChecklistResult.IsSuccess) return renameChecklistResult.Error!;
        
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

    public async Task<Result<ChecklistItemGetDto>> CreateChecklistItem(int boardId, int cardId, int checklistId, 
        ChecklistItemCreateDto checklistItemCreateDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;

        Checklist? checklist = card.Checklists.FirstOrDefault(c => c.ChecklistId == checklistId);
        if (checklist is null) return Errors.NotFound;
        
        Result<ChecklistItem> createdChecklistItemResult = checklist.AddChecklistItem(checklistItemCreateDto.ChecklistItemName);
        if (!createdChecklistItemResult.IsSuccess) return createdChecklistItemResult.Error!;
        
        await unitOfWork.SaveChangesAsync();

        ChecklistItemGetDto checklistItemGetDto = createdChecklistItemResult.Value!.ToGetDto();
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

    public async Task<Result<ChecklistItemGetDto>> UpdateChecklistItem(int boardId, int cardId, int checklistId, 
        ChecklistItemUpdateDto checklistItemUpdateDto)
    {
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;
        
        Checklist? checklist = card.Checklists.FirstOrDefault(c => c.ChecklistId == checklistId);
        if (checklist is null) return Errors.NotFound;
        ChecklistItem? checklistItem = checklist.ChecklistItems.FirstOrDefault(ci => ci.ChecklistItemId == checklistItemUpdateDto.ChecklistItemId);
        if (checklistItem is null) return Errors.NotFound;
        
        Result renameChecklistItemResult = checklistItem.RenameChecklistItem(checklistItemUpdateDto.ChecklistItemName);
        if (!renameChecklistItemResult.IsSuccess) return renameChecklistItemResult.Error!;
        
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