using ArhiTodo.Interfaces;
using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Patch;
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

            return Ok(card.ToCardGetDto());
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpPatch("card/{cardId:int}/done/{isDone:bool}")]
    public async Task<IActionResult> PatchCardStatus(int cardId, bool isDone)
    {
        try
        {
            Card? card = await _cardRepository.PatchCardStatus(cardId, isDone);
            if (card == null) return NotFound();
            return Ok(card.ToDetailedCardGetDto());
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpPatch("card/{cardId:int}/name")]
    public async Task<IActionResult> PatchCardName(int cardId, [FromBody] PatchCardNameDto patchCardNameDto)
    {
        try
        {
            Card? card = await _cardRepository.PatchCardName(cardId, patchCardNameDto);
            if (card == null) return NotFound();
            return Ok(card.ToDetailedCardGetDto());
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpPatch("card/{cardId:int}/description")]
    public async Task<IActionResult> PatchCardDescription(int cardId, [FromBody] PatchCardDescriptionDto patchCardDescriptionDto)
    {
        try
        {
            Card? card = await _cardRepository.PatchCardDescription(cardId, patchCardDescriptionDto);
            if (card == null) return NotFound();
            return Ok(card.ToDetailedCardGetDto());
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
    
    [HttpDelete("card/{cardId:int}")]
    public async Task<IActionResult> DeleteCard(int cardId)
    {
        try
        {
            bool success = await _cardRepository.DeleteAsync(cardId);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpGet("project/{projectId:int}/board/{boardId:int}/card/{cardId:int}")]
    public async Task<IActionResult> GetDetailedCard(int projectId, int boardId, int cardId)
    {
        try
        {
            DetailedCardGetDto? detailedCardGetDto = await _cardRepository.GetDetailedCard(cardId);
            if (detailedCardGetDto == null) return NotFound();
            return Ok(detailedCardGetDto);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}