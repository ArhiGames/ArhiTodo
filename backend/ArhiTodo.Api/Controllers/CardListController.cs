using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

// @Todo
// [Authorize]
[ApiController]
[Route("api")]
public class CardListController(ICardListService cardListService) : ControllerBase
{
    [HttpPost("board/{boardId:int}/cardlist")]
    public async Task<IActionResult> PostCardList(int boardId, [FromBody] CardListCreateDto cardListCreateDto)
    {
        CardListGetDto? cardList = await cardListService.CreateCardList(boardId, cardListCreateDto);
        if (cardList == null) return NotFound();
        return Ok(cardList);
    }

    [HttpDelete("board/{boardId:int}/cardlist/{cardListId:int}")]
    public async Task<IActionResult> DeleteCardList(int boardId, int cardListId)
    {
        bool success = await cardListService.DeleteCardList(boardId, cardListId);
        if (!success) return NotFound();
        return NoContent();
    }
}