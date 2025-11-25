using ArhiTodo.DataBase;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CardsController : ControllerBase
{
    private readonly BoardDataBase _board;

    public CardsController(BoardDataBase board)
    {
        _board = board;
    }

    [HttpPost("postcardlist/")]
    public async Task<IActionResult> PostCardList(int boardId, [FromBody] CardListPostDto cardListPostDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        Board? board = await _board.Boards.
            Include(b => b.CardLists)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null) return NotFound();

        if (board.CardLists.Any(existingCardList => existingCardList.CardName == cardListPostDto.CardName))
        {
            return Conflict("Card list with the same name already exists");
        }
        
        CardList cardList = new()
        {
            CardName = cardListPostDto.CardName
        };
        
        board.CardLists.Add(cardList);
        await _board.SaveChangesAsync();
        
        return Ok();
    }

    [HttpDelete("postcardlist/")]
    public async Task<IActionResult> DeleteCardList(int boardId, int cardListId)
    {
        Board? board = await _board.Boards
            .Include(b => b.CardLists)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null) return NotFound();
        
        CardList? cardList = board.CardLists.Find(cardList => cardList.CardListId == cardListId);
        if (cardList == null) return NotFound();

        board.CardLists.Remove(cardList);
        await _board.SaveChangesAsync();
        
        return Ok();
    }

    [HttpPost("postcard/")]
    public async Task<IActionResult> PostCard(int boardId, int cardListId, [FromBody] CardPostDto cardPostDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        Board? board = await _board.Boards
            .Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null) return NotFound();

        CardList? cardList = board.CardLists.Find(cardList => cardList.CardListId == cardListId);
        if (cardList == null) return NotFound();

        Card card = new()
        {
            CardName = cardPostDto.CardName
        };
        
        cardList.Cards!.Add(card);
        await _board.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("postcard/")]
    public async Task<IActionResult> DeleteCard(int boardId, int cardListId, int cardId)
    {
        Board? board = await _board.Boards
            .Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null) return NotFound();
        
        CardList? cardList = board.CardLists.Find(cardList => cardList.CardListId == cardListId);
        if (cardList == null) return NotFound();
        
        Card? card = cardList.Cards.Find(card => card.CardId == cardId);
        if (card == null) return NotFound();
        
        cardList.Cards.Remove(card);
        await _board.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> Get(int boardId)
    {
        Board? board = await _board.Boards
            .Include(b => b.CardLists)
                .ThenInclude(cl => cl.Cards)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null) return NotFound();
            
        return Ok(board);
    }
}