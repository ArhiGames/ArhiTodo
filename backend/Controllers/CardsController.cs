using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Services;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CardsController : ControllerBase
{
    private readonly CardService _cardService;

    public CardsController(CardService cardService)
    {
        _cardService = cardService;
    }

    [HttpPost("postcardlist/")]
    public async Task<IActionResult> PostCardList(int projectId, int boardId, [FromBody] CardListPostDto cardListPostDto)
    {
        try
        {
            CardList? cardList = await _cardService.PostCardList(projectId, boardId, cardListPostDto);
            if (cardList == null) return NotFound();
            return Ok(cardList);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpDelete("postcardlist/")]
    public async Task<IActionResult> DeleteCardList(int projectId, int boardId, int cardListId)
    {
        try
        {
            bool success = await _cardService.DeleteCardList(projectId, boardId, cardListId);
            if (!success) return NotFound();
            return Ok();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpPost("postcard/")]
    public async Task<IActionResult> PostCard(int projectId, int boardId, int cardListId, [FromBody] CardPostDto cardPostDto)
    {
        try
        {
            Card? card = await _cardService.PostCard(projectId, boardId, cardListId, cardPostDto);
            if (card == null) return NotFound();
            return Ok(card);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpDelete("postcard/")]
    public async Task<IActionResult> DeleteCard(int projectId, int boardId, int cardListId, int cardId)
    {
        try
        {
            bool success = await _cardService.DeleteCard(projectId, boardId, cardListId, cardId);
            if (!success) return NotFound();
            return Ok();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpGet]
    public async Task<IActionResult> Get(int projectId, int boardId)
    {
        try
        {
            ProjectGetDto? projectGetDto = await _cardService.GetAllCardsDTOs(projectId, boardId);
            if (projectGetDto == null) return NotFound();
            return Ok(projectGetDto);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}