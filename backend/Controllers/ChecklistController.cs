using ArhiTodo.Interfaces;
using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Authorize]
[ApiController]
[Route("api")]
public class ChecklistController : ControllerBase
{
    private readonly IChecklistRepository _checklistRepository;

    public ChecklistController(IChecklistRepository checklistRepository)
    {
        _checklistRepository = checklistRepository;
    }

    [HttpPost("card/{cardId:int}/checklist")]
    public async Task<IActionResult> CreateChecklistOnCard(int cardId, [FromBody] ChecklistPostDto checklistPostDto)
    {
        Checklist? checklist = await _checklistRepository.CreateChecklistOnCard(cardId, checklistPostDto);
        if (checklist == null) return NotFound();

        return Ok(checklist.ToChecklistGetDto());
    }

    [HttpDelete("card/{cardId:int}/checklist/{checklistId:int}")]
    public async Task<IActionResult> DeleteChecklistFromCard(int cardId, int checklistId)
    {
        bool succeeded = await _checklistRepository.DeleteChecklistFromCard(cardId, checklistId);
        if (succeeded) return NoContent();
        return NotFound();
    }

    [HttpPost("checklist/{checklistId:int}/item")]
    public async Task<IActionResult> CreateChecklistItemOnChecklist(int checklistId, [FromBody] ChecklistItemPostDto checklistItemPostDto)
    {
        ChecklistItem? checklistItem =
            await _checklistRepository.AddChecklistItemToChecklist(checklistId, checklistItemPostDto);
        if (checklistItem == null) return NotFound();
        return Ok(checklistItem.ToChecklistItemGetDto());
    }

    [HttpDelete("checklist/{checklistId:int}/item/{checklistItemId:int}")]
    public async Task<IActionResult> DeleteChecklistItemFromChecklist(int checklistId, int checklistItemId)
    {
        bool succeeded = await _checklistRepository.RemoveChecklistItemFromChecklist(checklistId, checklistItemId);
        if (succeeded) return NoContent();
        return NotFound();
    }

    [HttpPatch("checklist/item/{checklistItemId:int}/done/{taskDone:bool}")]
    public async Task<IActionResult> PatchChecklistItemDoneState(int checklistItemId, bool taskDone)
    {
        ChecklistItem? checklistItem =
            await _checklistRepository.PatchChecklistItemDoneState(checklistItemId, taskDone);
        if (checklistItem == null)
        {
            return NotFound();
        }
        return Ok(checklistItem.ToChecklistItemGetDto());
    }
}