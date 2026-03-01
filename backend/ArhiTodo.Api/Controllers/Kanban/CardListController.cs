using ArhiTodo.Application.DTOs.CardList;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;
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
        return cardList.IsSuccess ? Ok(cardList.Value) : HandleFailure(cardList);
    }

    [HttpPatch("board/{boardId:int}/cardlist/{cardListId:int}/move/{location:int}")]
    public async Task<IActionResult> MoveCardList(int boardId, int cardListId, int location)
    {
        Result moveCardListResult = await cardListService.MoveCardList(boardId, cardListId, location);
        return moveCardListResult.IsSuccess ? Ok() : HandleFailure(moveCardListResult);
    }

    [HttpDelete("board/{boardId:int}/cardlist/{cardListId:int}/cards")]
    public async Task<IActionResult> DeleteCards(int boardId, int cardListId)
    {
        Result deleteCardsResult = await cardListService.DeleteCards(boardId, cardListId);
        return deleteCardsResult.IsSuccess ? NoContent() : HandleFailure(deleteCardsResult);
    }

    [HttpDelete("board/{boardId:int}/cardlist/{cardListId:int}")]
    public async Task<IActionResult> DeleteCardList(int boardId, int cardListId)
    {
        Result deleteCardListResult = await cardListService.DeleteCardList(boardId, cardListId);
        return deleteCardListResult.IsSuccess ? NoContent() : HandleFailure(deleteCardListResult);
    }
}