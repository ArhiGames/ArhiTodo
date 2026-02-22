using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Kanban;

[Authorize]
[ApiController]
[Route("api")]
public class CardsController(ICardService cardService, ILabelService labelService) : ApiControllerBase
{
    [HttpPost("board/{boardId:int}/card/{cardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> AddLabelToCard(int boardId, int cardId, int labelId)
    {
        Result addLabelToCardResult = await labelService.AddLabelToCard(boardId, cardId, labelId);
        return addLabelToCardResult.IsSuccess ? Ok() : HandleFailure(addLabelToCardResult);
    }

    [HttpDelete("board/{boardId:int}/card/{cardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> RemoveLabelFromCard(int boardId, int cardId, int labelId)
    {
        Result removeLabelFromCardResult = await labelService.RemoveLabelFromCard(boardId, cardId, labelId);
        return removeLabelFromCardResult.IsSuccess ? NoContent() : HandleFailure(removeLabelFromCardResult);
    }

    [HttpPost("board/{boardId:int}/cardlist/{cardListId:int}/card")]
    public async Task<IActionResult> PostCard(int boardId, int cardListId, [FromBody] CardCreateDto cardCreateDto)
    {
        Result<CardGetDto> card = await cardService.CreateCard(boardId, cardListId, cardCreateDto);
        return card.IsSuccess ? Ok(card.Value) : HandleFailure(card);
    }

    [HttpPatch("board/{boardId:int}/card/{cardId:int}/move")]
    public async Task<IActionResult> MoveCard(int boardId, int cardId,
        [FromBody] MoveCardPatchDto moveCardPatchDto)
    {
        Result moveCardResult = await cardService.MoveCard(boardId, cardId, moveCardPatchDto);
        return moveCardResult.IsSuccess ? Ok() : HandleFailure(moveCardResult);
    }
    
    
    [HttpDelete("board/{boardId:int}/card/{cardId:int}")]
    public async Task<IActionResult> DeleteCard(int boardId, int cardId)
    {
        Result deleteCardResult = await cardService.DeleteCard(boardId, cardId);
        return deleteCardResult.IsSuccess ? NoContent() : HandleFailure(deleteCardResult);
    }

    [HttpPost("board/{boardId:int}/card/{cardId:int}/assign/user/{userId:guid}")]
    public async Task<IActionResult> AssignUser(int boardId, int cardId, Guid userId)
    {
        Result assignUserResult = await cardService.AssignUser(boardId, cardId, userId);
        return assignUserResult.IsSuccess ? Ok() : HandleFailure(assignUserResult);
    }

    [HttpDelete("board/{boardId:int}/card/{cardId:int}/unassign/user/{userId:guid}")]
    public async Task<IActionResult> UnassignUser(int boardId, int cardId, Guid userId)
    {
        Result unassignUserResult = await cardService.UnassignUser(boardId, cardId, userId);
        return unassignUserResult.IsSuccess ? NoContent() : HandleFailure(unassignUserResult);
    }
    
    [HttpPatch("board/{boardId:int}/card/{cardId:int}/done/{isDone:bool}")]
    public async Task<IActionResult> PatchCardStatus(int boardId, int cardId, bool isDone)
    {
        Result<CardGetDto> updateCardResult = await cardService.PatchCardStatus(boardId, cardId, isDone);
        return updateCardResult.IsSuccess ? Ok() : HandleFailure(updateCardResult);
    }

    [HttpPatch("board/{boardId:int}/card/{cardId:int}/name")]
    public async Task<IActionResult> PatchCardName(int boardId, int cardId, [FromBody] PatchCardNameDto patchCardNameDto)
    {
        Result<CardGetDto> cardGetDto = await cardService.PatchCardName(boardId, cardId, patchCardNameDto);
        return cardGetDto.IsSuccess ? Ok() : HandleFailure(cardGetDto);
    }

    [HttpPatch("card/{cardId:int}/description")]
    public async Task<IActionResult> PatchCardDescription(int cardId, [FromBody] PatchCardDescriptionDto patchCardDescriptionDto)
    {
        Result<CardGetDto> updateCardResult = await cardService.PatchCardDescription(cardId, patchCardDescriptionDto);
        return updateCardResult.IsSuccess ? Ok() : HandleFailure(updateCardResult);
    }

    [HttpGet("card/{cardId:int}")]
    public async Task<IActionResult> GetDetailedCard(int cardId)
    {
        Result<CardGetDto> getCardResult = await cardService.GetCard(cardId);
        return getCardResult.IsSuccess ? Ok(getCardResult.Value) : HandleFailure(getCardResult);
    }
}