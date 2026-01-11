using ArhiTodo.Application.DTOs.Checklist;
using ArhiTodo.Application.DTOs.ChecklistItem;
using ArhiTodo.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

// @Todo
// [Authorize]
[ApiController]
[Route("api")]
public class ChecklistController(IChecklistService checklistService) : ControllerBase
{
    [HttpPost("card/{cardId:int}/checklist")]
    public async Task<IActionResult> CreateChecklistOnCard(int cardId, [FromBody] ChecklistCreateDto checklistCreateDto)
    {
        ChecklistGetDto? checklist = await checklistService.CreateChecklist(cardId, checklistCreateDto);
        if (checklist == null) return NotFound();
        return Ok(checklist);
    }

    [HttpDelete("card/{cardId:int}/checklist/{checklistId:int}")]
    public async Task<IActionResult> DeleteChecklistFromCard(int cardId, int checklistId)
    {
        bool succeeded = await checklistService.DeleteChecklist(checklistId);
        if (!succeeded) return NotFound();
        return NoContent();
    }

    [HttpPost("checklist/{checklistId:int}/item")]
    public async Task<IActionResult> CreateChecklistItemOnChecklist(int checklistId, [FromBody] ChecklistItemCreateDto checklistItemCreateDto)
    {
        ChecklistItemGetDto? checklistItemGetDto =
            await checklistService.CreateChecklistItem(checklistId, checklistItemCreateDto);
        if (checklistItemGetDto == null) return NotFound();
        return Ok(checklistItemGetDto);
    }

    [HttpDelete("checklist/{checklistId:int}/item/{checklistItemId:int}")]
    public async Task<IActionResult> DeleteChecklistItemFromChecklist(int checklistId, int checklistItemId)
    {
        bool succeeded = await checklistService.DeleteChecklistItem(checklistItemId);
        if (!succeeded) return NotFound();
        return NoContent();
    }

    [HttpPatch("checklist/item/{checklistItemId:int}/done/{taskDone:bool}")]
    public async Task<IActionResult> PatchChecklistItemDoneState(int checklistItemId, bool taskDone)
    {
        bool succeeded = await checklistService.PatchChecklistItemState(checklistItemId, taskDone);
        if (!succeeded) return NotFound();
        return Ok();
    }
}