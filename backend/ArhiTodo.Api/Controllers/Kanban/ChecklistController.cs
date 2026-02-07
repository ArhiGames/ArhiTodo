using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Kanban;

[Authorize]
[ApiController]
[Route("api")]
public class ChecklistController(IChecklistService checklistService) : ControllerBase
{
    [HttpPost("board/{boardId:int}/card/{cardId:int}/checklist")]
    public async Task<IActionResult> CreateChecklistOnCard(int boardId, int cardId, [FromBody] ChecklistCreateDto checklistCreateDto)
    {
        ChecklistGetDto? checklist = await checklistService.CreateChecklist(boardId, cardId, checklistCreateDto);
        if (checklist == null) return NotFound();
        return Ok(checklist);
    }

    [HttpPut("board/{boardId:int}/card/{cardId:int}/checklist")]
    public async Task<IActionResult> UpdateChecklist(int boardId, int cardId, [FromBody] ChecklistUpdateDto checklistUpdateDto)
    {
        ChecklistGetDto? checklist = await checklistService.UpdateChecklist(boardId, cardId, checklistUpdateDto);
        if (checklist == null) return NotFound();
        return Ok(checklist);
    }

    [HttpDelete("board/{boardId:int}/card/{cardId:int}/checklist/{checklistId:int}")]
    public async Task<IActionResult> DeleteChecklistFromCard(int boardId, int cardId, int checklistId)
    {
        bool succeeded = await checklistService.DeleteChecklist(boardId, cardId, checklistId);
        if (!succeeded) return NotFound();
        return NoContent();
    }

    [HttpPost("board/{boardId:int}/card/{cardId:int}/checklist/{checklistId:int}/item")]
    public async Task<IActionResult> CreateChecklistItemOnChecklist(int boardId, int cardId, 
        int checklistId, [FromBody] ChecklistItemCreateDto checklistItemCreateDto)
    {
        ChecklistItemGetDto? checklistItemGetDto =
            await checklistService.CreateChecklistItem(boardId, cardId, checklistId, checklistItemCreateDto);
        if (checklistItemGetDto == null) return NotFound();
        return Ok(checklistItemGetDto);
    }

    [HttpPut("board/{boardId:int}/card/{cardId:int}/checklist/{checklistId:int}/item")]
    public async Task<IActionResult> UpdateChecklistItem(int boardId, int cardId, 
        int checklistId, [FromBody] ChecklistItemUpdateDto checklistItemUpdateDto)
    {
        ChecklistItemGetDto? checklistItemGetDto =
            await checklistService.UpdateChecklistItem(boardId, cardId, checklistId, checklistItemUpdateDto);
        if (checklistItemGetDto == null) return NotFound();
        return Ok(checklistItemGetDto);
    }

    [HttpDelete("board/{boardId:int}/card/{cardId:int}/checklist/{checklistId:int}/item/{checklistItemId:int}")]
    public async Task<IActionResult> DeleteChecklistItemFromChecklist(int boardId, int cardId, int checklistId, int checklistItemId)
    {
        bool succeeded = await checklistService.DeleteChecklistItem(boardId, cardId, checklistId, checklistItemId);
        if (!succeeded) return NotFound();
        return NoContent();
    }

    [HttpPatch("board/{boardId:int}/card/{cardId:int}/checklist/item/{checklistItemId:int}/done/{taskDone:bool}")]
    public async Task<IActionResult> PatchChecklistItemDoneState(int boardId, int cardId, int checklistItemId, bool taskDone)
    {
        ChecklistItemGetDto? checklistItemGetDto = await checklistService.PatchChecklistItemState(boardId, cardId, checklistItemId, taskDone);
        if (checklistItemGetDto == null) return NotFound();
        return Ok(checklistItemGetDto);
    }
}