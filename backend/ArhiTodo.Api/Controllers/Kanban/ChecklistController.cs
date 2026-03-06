using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Kanban;

[Authorize]
[ApiController]
[Route("api/board/{boardId:int}/card/{cardId:int}/checklist")]
public class ChecklistController(IChecklistService checklistService) : ApiControllerBase
{
    [HttpPost("")]
    public async Task<IActionResult> CreateChecklistOnCard(int boardId, int cardId, [FromBody] ChecklistCreateDto checklistCreateDto)
    {
        Result<ChecklistGetDto> createChecklistResult = await checklistService.CreateChecklist(boardId, cardId, checklistCreateDto);
        return createChecklistResult.IsSuccess ? Ok(createChecklistResult.Value) : HandleFailure(createChecklistResult);
    }

    [HttpPut("")]
    public async Task<IActionResult> UpdateChecklist(int boardId, int cardId, [FromBody] ChecklistUpdateDto checklistUpdateDto)
    {
        Result<ChecklistGetDto> updateChecklistResult = await checklistService.UpdateChecklist(boardId, cardId, checklistUpdateDto);
        return updateChecklistResult.IsSuccess ? Ok(updateChecklistResult.Value) : HandleFailure(updateChecklistResult);
    }
    
    [HttpPatch("{checklistId:int}/move/{location:int}")]
    public async Task<IActionResult> MoveChecklist(int boardId, int cardId, int checklistId, int location)
    {
        Result moveChecklistResult = await checklistService.MoveChecklist(boardId, cardId, checklistId, location);
        return moveChecklistResult.IsSuccess ? Ok() : HandleFailure(moveChecklistResult);
    }

    [HttpDelete("{checklistId:int}")]
    public async Task<IActionResult> DeleteChecklistFromCard(int boardId, int cardId, int checklistId)
    {
        Result deleteChecklistResult = await checklistService.DeleteChecklist(boardId, cardId, checklistId);
        return deleteChecklistResult.IsSuccess ? NoContent() : HandleFailure(deleteChecklistResult);
    }

    [HttpPost("{checklistId:int}/item")]
    public async Task<IActionResult> CreateChecklistItemOnChecklist(int boardId, int cardId, 
        int checklistId, [FromBody] ChecklistItemCreateDto checklistItemCreateDto)
    {
        Result<ChecklistItemGetDto> checklistItemGetDto =
            await checklistService.CreateChecklistItem(boardId, cardId, checklistId, checklistItemCreateDto);
        return checklistItemGetDto.IsSuccess ? Ok(checklistItemGetDto.Value) : HandleFailure(checklistItemGetDto);
    }

    [HttpPut("{checklistId:int}/item")]
    public async Task<IActionResult> UpdateChecklistItem(int boardId, int cardId, 
        int checklistId, [FromBody] ChecklistItemUpdateDto checklistItemUpdateDto)
    {
        Result<ChecklistItemGetDto> checklistItemGetDto =
            await checklistService.UpdateChecklistItem(boardId, cardId, checklistId, checklistItemUpdateDto);
        return checklistItemGetDto.IsSuccess ? Ok(checklistItemGetDto.Value) : HandleFailure(checklistItemGetDto);
    }
    
    [HttpPatch("item/{checklistItemId:int}/move")]
    public async Task<IActionResult> MoveChecklistItem(int boardId, int cardId, int checklistItemId,
        [FromBody] MoveChecklistItemPatchDto moveChecklistItemPatchDto)
    {
        Result moveChecklistItemResult = await checklistService.MoveChecklistItem(boardId, cardId, checklistItemId, moveChecklistItemPatchDto);
        return moveChecklistItemResult.IsSuccess ? Ok() : HandleFailure(moveChecklistItemResult);
    }

    [HttpDelete("{checklistId:int}/item/{checklistItemId:int}")]
    public async Task<IActionResult> DeleteChecklistItemFromChecklist(int boardId, int cardId, int checklistId, int checklistItemId)
    {
        Result deleteChecklistItemResult = await checklistService.DeleteChecklistItem(boardId, cardId, checklistId, checklistItemId);
        return deleteChecklistItemResult.IsSuccess ? NoContent() : HandleFailure(deleteChecklistItemResult);
    }

    [HttpPatch("item/{checklistItemId:int}/done/{taskDone:bool}")]
    public async Task<IActionResult> PatchChecklistItemDoneState(int boardId, int cardId, int checklistItemId, bool taskDone)
    {
        Result<ChecklistItemGetDto> patchChecklistItemStateResult = await checklistService.PatchChecklistItemState(boardId, cardId, checklistItemId, taskDone);
        return patchChecklistItemStateResult.IsSuccess ? Ok(patchChecklistItemStateResult.Value) : HandleFailure(patchChecklistItemStateResult);
    }
}