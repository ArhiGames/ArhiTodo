using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Common.Result;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Kanban;

[Authorize]
[ApiController]
[Route("api")]
public class CardListController(ICardListService cardListService) : ApiControllerBase
{
    [HttpPost("board/{boardId:int}/cardlist")]
    public async Task<IActionResult> PostCardList(int boardId, [FromBody] CardListCreateDto cardListCreateDto)
    {
        Result<CardListGetDto> cardList = await cardListService.CreateCardList(boardId, cardListCreateDto);
        return cardList.IsSuccess ? Ok(cardList.Value) : HandleFailure(cardList);
    }

    [HttpPut("board/{boardId:int}/cardlist")]
    public async Task<IActionResult> UpdateCardList(int boardId, [FromBody] CardListUpdateDto cardListUpdateDto)
    {
        Result<CardListGetDto> cardList = await cardListService.UpdateCardList(boardId, cardListUpdateDto);
        return cardList.IsSuccess ? Ok(cardList) : HandleFailure(cardList);
    }

    [HttpDelete("board/{boardId:int}/cardlist/{cardListId:int}/cards")]
    public async Task<IActionResult> DeleteCards(int boardId, int cardListId)
    {
        bool succeeded = await cardListService.DeleteCards(boardId, cardListId);
        if (!succeeded) return NotFound();
        return NoContent();
    }

    [HttpDelete("board/{boardId:int}/cardlist/{cardListId:int}")]
    public async Task<IActionResult> DeleteCardList(int boardId, int cardListId)
    {
        bool success = await cardListService.DeleteCardList(boardId, cardListId);
        if (!success) return NotFound();
        return NoContent();
    }
}