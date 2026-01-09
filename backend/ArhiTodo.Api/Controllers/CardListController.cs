using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Authorize]
[ApiController]
[Route("api")]
public class CardListController : ControllerBase
{
    [HttpPost("board/{boardId:int}/cardlist")]
    public async Task<IActionResult> PostCardList(int boardId, [FromBody] CardListPostDto cardListPostDto)
    {
        CardList? cardList = await _cardlistRepository.CreateAsync(boardId, cardListPostDto);
        if (cardList == null) return NotFound();

        CardListGetDto cardListGetDto = cardList.ToCardlistGetDto();
        return Ok(cardListGetDto);
    }

    [HttpDelete("board/{boardId:int}/cardlist/{cardListId:int}")]
    public async Task<IActionResult> DeleteCardList(int boardId, int cardListId)
    {
        bool success = await _cardlistRepository.DeleteAsync(boardId, cardListId);
        if (!success) return NotFound();
        
        return NoContent();
    }
}