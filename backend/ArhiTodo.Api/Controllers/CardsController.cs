using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Authorize]
[ApiController]
[Route("api")]
public class CardsController(ICardService cardService, ILabelService labelService) : ControllerBase
{
    [HttpPost("card/{cardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> AddLabelToCard(int cardId, int labelId)
    {
        bool result = await labelService.AddLabelToCard(cardId, labelId);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpDelete("card/{cardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> RemoveLabelFromCard(int cardId, int labelId)
    {
        bool result = await labelService.RemoveLabelFromCard(cardId, labelId);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPost("board/{boardId:int}/cardlist/{cardListId:int}/card")]
    public async Task<IActionResult> PostCard(int boardId, int cardListId, [FromBody] CardCreateDto cardCreateDto)
    {
        CardGetDto? card = await cardService.CreateCard(boardId, cardListId, cardCreateDto);
        if (card == null) return NotFound();
        return Ok(card);
    }
    
    [HttpDelete("project/{projectId:int}/board/{boardId:int}/card/{cardId:int}")]
    public async Task<IActionResult> DeleteCard(int projectId, int boardId, int cardId)
    {
        bool success = await cardService.DeleteCard(projectId, boardId, cardId);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpPatch("card/{cardId:int}/done/{isDone:bool}")]
    public async Task<IActionResult> PatchCardStatus(int cardId, bool isDone)
    {
        CardGetDto? cardGetDto = await cardService.PatchCardStatus(cardId, isDone);
        if (cardGetDto == null) return NotFound();
        return Ok();
    }

    [HttpPatch("card/{cardId:int}/name")]
    public async Task<IActionResult> PatchCardName(int cardId, [FromBody] PatchCardNameDto patchCardNameDto)
    {
        CardGetDto? cardGetDto = await cardService.PatchCardName(cardId, patchCardNameDto);
        if (cardGetDto == null) return NotFound();
        return Ok();
    }

    [HttpPatch("card/{cardId:int}/description")]
    public async Task<IActionResult> PatchCardDescription(int cardId, [FromBody] PatchCardDescriptionDto patchCardDescriptionDto)
    {
        CardGetDto? cardGetDto = await cardService.PatchCardDescription(cardId, patchCardDescriptionDto);
        if (cardGetDto == null) return NotFound();
        return Ok();
    }

    [HttpGet("card/{cardId:int}")]
    public async Task<IActionResult> GetDetailedCard(int cardId)
    {
        CardGetDto? card = await cardService.GetCard(cardId);
        if (card == null) return NotFound();
        return Ok(card);
    }
}