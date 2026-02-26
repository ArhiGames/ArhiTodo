using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
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

public class ChecklistService(ICardRepository cardRepository, IChecklistNotificationService checklistNotificationService,
    IUnitOfWork unitOfWork, ICardAuthorizer cardAuthorizer) : IChecklistService
{
    public async Task<Result<ChecklistGetDto>> CreateChecklist(int boardId, int cardId, ChecklistCreateDto checklistCreateDto)
    {
        bool hasCreateChecklistPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasCreateChecklistPermission) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;

        List<Checklist> sortedChecklists = card.Checklists.OrderBy(cl => cl.Position).ToList();

        Result<Checklist> createChecklistResult = Checklist.Create(cardId, checklistCreateDto.ChecklistName,
            sortedChecklists.Count > 0 ? sortedChecklists.Last().Position : null);
        if (!createChecklistResult.IsSuccess) return createChecklistResult.Error!;
        
        card.AddChecklist(createChecklistResult.Value!);
        await unitOfWork.SaveChangesAsync();

        ChecklistGetDto checklistGetDto = createChecklistResult.Value!.ToGetDto();
        checklistNotificationService.CreateChecklist(boardId, cardId, checklistGetDto);
        return checklistGetDto;
    }

    public async Task<Result<ChecklistGetDto>> UpdateChecklist(int boardId, int cardId, ChecklistUpdateDto checklistUpdateDto)
    {
        bool hasUpdateChecklistPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasUpdateChecklistPermission) return Errors.Forbidden;
        
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

    public async Task<Result> DeleteChecklist(int boardId, int cardId, int checklistId)
    {
        bool hasDeleteChecklistPermission = await cardAuthorizer.HasDeleteCardPermission(cardId);
        if (!hasDeleteChecklistPermission) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card == null) return Errors.NotFound;

        Result removeChecklistResult = card.RemoveChecklist(checklistId);
        if (removeChecklistResult.IsSuccess)
        {
            checklistNotificationService.DeleteChecklist(boardId, checklistId);
            await unitOfWork.SaveChangesAsync();
        }
        return removeChecklistResult;
    }

    public async Task<Result<ChecklistItemGetDto>> CreateChecklistItem(int boardId, int cardId, int checklistId, 
        ChecklistItemCreateDto checklistItemCreateDto)
    {
        bool hasCreateChecklistItemPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasCreateChecklistItemPermission) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;

        Checklist? checklist = card.Checklists.FirstOrDefault(c => c.ChecklistId == checklistId);
        if (checklist is null) return Errors.NotFound;

        List<ChecklistItem> sortedChecklistItems = checklist.ChecklistItems.OrderBy(ci => ci.Position).ToList();
        
        Result<ChecklistItem> createdChecklistItemResult = checklist.AddChecklistItem(checklistItemCreateDto.ChecklistItemName,
            sortedChecklistItems.Count > 0 ? sortedChecklistItems.Last().Position : null);
        if (!createdChecklistItemResult.IsSuccess) return createdChecklistItemResult.Error!;
        
        await unitOfWork.SaveChangesAsync();

        ChecklistItemGetDto checklistItemGetDto = createdChecklistItemResult.Value!.ToGetDto();
        checklistNotificationService.CreateChecklistItemOnChecklist(boardId, checklistId, checklistItemGetDto);
        return checklistItemGetDto;
    }
    
    public async Task<Result> DeleteChecklistItem(int boardId, int cardId, int checklistId, int checklistItemId)
    {
        bool hasDeleteChecklistItemPermission = await cardAuthorizer.HasDeleteCardPermission(cardId);
        if (!hasDeleteChecklistItemPermission) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;
        
        Checklist? checklist = card.Checklists.FirstOrDefault(c => c.ChecklistId == checklistId);
        if (checklist is null) return Errors.NotFound;

        Result removeChecklistItemResult = checklist.RemoveChecklistItem(checklistItemId);
        if (removeChecklistItemResult.IsSuccess)
        {
            await unitOfWork.SaveChangesAsync();
            checklistNotificationService.DeleteChecklistItemFromChecklist(boardId, checklistId, checklistItemId);
        }
        return removeChecklistItemResult;
    }

    public async Task<Result<ChecklistItemGetDto>> UpdateChecklistItem(int boardId, int cardId, int checklistId, 
        ChecklistItemUpdateDto checklistItemUpdateDto)
    {
        bool hasEditChecklistItemPermission = await cardAuthorizer.HasEditCardPermission(cardId);
        if (!hasEditChecklistItemPermission) return Errors.Forbidden;
        
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

    public async Task<Result<ChecklistItemGetDto>> PatchChecklistItemState(int boardId, int cardId, int checklistItemId, bool newState)
    {
        bool hasEditChecklistItemPermission = await cardAuthorizer.HasEditCardPermission(cardId, true);
        if (!hasEditChecklistItemPermission) return Errors.Forbidden;
        
        Card? card = await cardRepository.GetDetailedCard(cardId);
        if (card is null) return Errors.NotFound;

        ChecklistItem? updateChecklistItem = card.UpdateChecklistItemState(checklistItemId, newState);
        if (updateChecklistItem is null) return Errors.NotFound;

        await unitOfWork.SaveChangesAsync();
        
        ChecklistItemGetDto checklistItemGetDto = updateChecklistItem.ToGetDto();
        checklistNotificationService.PatchChecklistItemDoneState(boardId, checklistItemId, newState);
        return checklistItemGetDto;
    }
}