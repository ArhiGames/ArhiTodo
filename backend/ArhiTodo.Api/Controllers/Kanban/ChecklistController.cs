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
[Route("api")]
public class ChecklistController(IChecklistService checklistService) : ApiControllerBase
{
    [HttpPost("board/{boardId:int}/card/{cardId:int}/checklist")]
    public async Task<IActionResult> CreateChecklistOnCard(int boardId, int cardId, [FromBody] ChecklistCreateDto checklistCreateDto)
    {
        Result<ChecklistGetDto> createChecklistResult = await checklistService.CreateChecklist(boardId, cardId, checklistCreateDto);
        return createChecklistResult.IsSuccess ? Ok(createChecklistResult.Value) : HandleFailure(createChecklistResult);
    }

    [HttpPut("board/{boardId:int}/card/{cardId:int}/checklist")]
    public async Task<IActionResult> UpdateChecklist(int boardId, int cardId, [FromBody] ChecklistUpdateDto checklistUpdateDto)
    {
        Result<ChecklistGetDto> updateChecklistResult = await checklistService.UpdateChecklist(boardId, cardId, checklistUpdateDto);
        return updateChecklistResult.IsSuccess ? Ok(updateChecklistResult.Value) : HandleFailure(updateChecklistResult);
    }

    [HttpDelete("board/{boardId:int}/card/{cardId:int}/checklist/{checklistId:int}")]
    public async Task<IActionResult> DeleteChecklistFromCard(int boardId, int cardId, int checklistId)
    {
        Result deleteChecklistResult = await checklistService.DeleteChecklist(boardId, cardId, checklistId);
        return deleteChecklistResult.IsSuccess ? NoContent() : HandleFailure(deleteChecklistResult);
    }

    [HttpPost("board/{boardId:int}/card/{cardId:int}/checklist/{checklistId:int}/item")]
    public async Task<IActionResult> CreateChecklistItemOnChecklist(int boardId, int cardId, 
        int checklistId, [FromBody] ChecklistItemCreateDto checklistItemCreateDto)
    {
        Result<ChecklistItemGetDto> checklistItemGetDto =
            await checklistService.CreateChecklistItem(boardId, cardId, checklistId, checklistItemCreateDto);
        return checklistItemGetDto.IsSuccess ? Ok(checklistItemGetDto.Value) : HandleFailure(checklistItemGetDto);
    }

    [HttpPut("board/{boardId:int}/card/{cardId:int}/checklist/{checklistId:int}/item")]
    public async Task<IActionResult> UpdateChecklistItem(int boardId, int cardId, 
        int checklistId, [FromBody] ChecklistItemUpdateDto checklistItemUpdateDto)
    {
        Result<ChecklistItemGetDto> checklistItemGetDto =
            await checklistService.UpdateChecklistItem(boardId, cardId, checklistId, checklistItemUpdateDto);
        return checklistItemGetDto.IsSuccess ? Ok(checklistItemGetDto.Value) : HandleFailure(checklistItemGetDto);
    }

    [HttpDelete("board/{boardId:int}/card/{cardId:int}/checklist/{checklistId:int}/item/{checklistItemId:int}")]
    public async Task<IActionResult> DeleteChecklistItemFromChecklist(int boardId, int cardId, int checklistId, int checklistItemId)
    {
        Result deleteChecklistItemResult = await checklistService.DeleteChecklistItem(boardId, cardId, checklistId, checklistItemId);
        return deleteChecklistItemResult.IsSuccess ? NoContent() : HandleFailure(deleteChecklistItemResult);
    }

    [HttpPatch("board/{boardId:int}/card/{cardId:int}/checklist/item/{checklistItemId:int}/done/{taskDone:bool}")]
    public async Task<IActionResult> PatchChecklistItemDoneState(int boardId, int cardId, int checklistItemId, bool taskDone)
    {
        Result<ChecklistItemGetDto> patchChecklistItemStateResult = await checklistService.PatchChecklistItemState(boardId, cardId, checklistItemId, taskDone);
        return patchChecklistItemStateResult.IsSuccess ? Ok(patchChecklistItemStateResult.Value) : HandleFailure(patchChecklistItemStateResult);
    }
}