using ArhiTodo.Interfaces;
using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Authorize]
[ApiController]
[Route("api")]
public class CardsController : ControllerBase
{
    private readonly ICardlistRepository _cardlistRepository;
    private readonly ICardRepository _cardRepository;
    private readonly ILabelRepository _labelRepository;
    
    public CardsController(ICardlistRepository cardlistRepository, ICardRepository cardRepository, ILabelRepository labelRepository)
    {
        _cardlistRepository = cardlistRepository;
        _cardRepository = cardRepository;
        _labelRepository = labelRepository;
    }

    [HttpPost("card/{cardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> AddLabelToCard(int cardId, int labelId)
    {
        bool result = await _labelRepository.AddLabelToCard(cardId, labelId);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpDelete("card/{cardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> RemoveLabelFromCard(int cardId, int labelId)
    {
        bool result = await _labelRepository.RemoveLabelFromCard(cardId, labelId);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPost("project/{projectId:int}/board/{boardId:int}/cardlist")]
    public async Task<IActionResult> PostCardList(int projectId, int boardId, [FromBody] CardListPostDto cardListPostDto)
    {
        try
        {
            CardList? cardList = await _cardlistRepository.CreateAsync(projectId, boardId, cardListPostDto);
            if (cardList == null) return NotFound();

            CardListGetDto cardListGetDto = cardList.ToCardlistGetDto();
            return Ok(cardListGetDto);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpDelete("project/{projectId:int}/board/{boardId:int}/cardlist/{cardListId:int}")]
    public async Task<IActionResult> DeleteCardList(int projectId, int boardId, int cardListId)
    {
        try
        {
            bool success = await _cardlistRepository.DeleteAsync(projectId, boardId, cardListId);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpPost("project/{projectId:int}/board/{boardId:int}/cardlist/{cardListId:int}/card")]
    public async Task<IActionResult> PostCard(int projectId, int boardId, int cardListId, [FromBody] CardPostDto cardPostDto)
    {
        try
        {
            Card? card = await _cardRepository.CreateAsync(projectId, boardId, cardListId, cardPostDto);
            if (card == null) return NotFound();

            CardGetDto cardGetDto = card.ToCardGetDto();
            
            return Ok(cardGetDto);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpDelete("project/{projectId:int}/board/{boardId:int}/cardlist/{cardListId:int}/card/{cardId:int}")]
    public async Task<IActionResult> DeleteCard(int projectId, int boardId, int cardListId, int cardId)
    {
        try
        {
            bool success = await _cardRepository.DeleteAsync(projectId, boardId, cardListId, cardId);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}