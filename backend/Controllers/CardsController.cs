using ArhiTodo.DataBase;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("[controller]")]
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
        
        CardList cardList = new()
        {
            CardName = cardListPostDto.CardName
        };
        
        board.CardLists!.Add(cardList);
        await _board.SaveChangesAsync();
        
        return Ok();
    }

    [HttpPost("postcard/")]
    public async Task<IActionResult> PostCard(int boardId, int cardListId, [FromBody] CardPostDto cardPostDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        Board? board = await _board.Boards
            .Include(b => b.CardLists)!
                .ThenInclude(cl => cl.Cards)
            .FirstOrDefaultAsync(b => b.BoardId == boardId);
        if (board == null) return NotFound();

        CardList? cardList = board.CardLists!.Find((CardList cardList) => cardList.CardListId == cardListId);
        if (cardList == null) return NotFound();

        Card card = new()
        {
            CardName = cardPostDto.CardName
        };
        
        cardList.Cards!.Add(card);
        await _board.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_board.Boards.Include(b => b.CardLists)!.ThenInclude(cl => cl.Cards));
    }
}