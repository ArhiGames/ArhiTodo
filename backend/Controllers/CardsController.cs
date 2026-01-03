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

    [HttpPost("cardlist/{cardListId:int}/card")]
    public async Task<IActionResult> PostCard(int cardListId, [FromBody] CardPostDto cardPostDto)
    {
        Card? card = await _cardRepository.CreateAsync(cardListId, cardPostDto);
        if (card == null) return NotFound();

        return Ok(card.ToCardGetDto());
    }

    [HttpPatch("card/{cardId:int}/done/{isDone:bool}")]
    public async Task<IActionResult> PatchCardStatus(int cardId, bool isDone)
    {
        Card? card = await _cardRepository.PatchCardStatus(cardId, isDone);
        if (card == null) return NotFound();
        
        return Ok(card.ToDetailedCardGetDto());
    }

    [HttpPatch("card/{cardId:int}/name")]
    public async Task<IActionResult> PatchCardName(int cardId, [FromBody] PatchCardNameDto patchCardNameDto)
    {
        Card? card = await _cardRepository.PatchCardName(cardId, patchCardNameDto);
        if (card == null) return NotFound();
        
        return Ok(card.ToDetailedCardGetDto());
    }

    [HttpPatch("card/{cardId:int}/description")]
    public async Task<IActionResult> PatchCardDescription(int cardId, [FromBody] PatchCardDescriptionDto patchCardDescriptionDto)
    {
        Card? card = await _cardRepository.PatchCardDescription(cardId, patchCardDescriptionDto);
        if (card == null) return NotFound();
        
        return Ok(card.ToDetailedCardGetDto());
    }
    
    [HttpDelete("card/{cardId:int}")]
    public async Task<IActionResult> DeleteCard(int cardId)
    {
        bool success = await _cardRepository.DeleteAsync(cardId);
        if (!success) return NotFound();
        
        return NoContent();
    }

    [HttpGet("card/{cardId:int}")]
    public async Task<IActionResult> GetDetailedCard(int cardId)
    {
        DetailedCardGetDto? detailedCardGetDto = await _cardRepository.GetDetailedCard(cardId);
        if (detailedCardGetDto == null) return NotFound();
        
        return Ok(detailedCardGetDto);
    }
}