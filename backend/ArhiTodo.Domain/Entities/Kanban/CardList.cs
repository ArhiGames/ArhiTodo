using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Helpers;

namespace ArhiTodo.Domain.Entities.Kanban;

public class CardList : Draggable
{
    public int BoardId { get; private set; }
    public Board Board { get; } = null!;
    
    public int CardListId { get; private set; }
    public string CardListName { get; private set; } = string.Empty;

    private readonly List<Card> _cards = [];
    public IReadOnlyCollection<Card> Cards => _cards.AsReadOnly();

    private CardList() : base("") { }

    private CardList(int boardId, string cardListName, string position) : base(position)
    {
        BoardId = boardId;
        CardListName = cardListName;
    }

    private static Result ValidateCardListName(string cardListName)
    {
        if (string.IsNullOrWhiteSpace(cardListName) || cardListName.Length < 1 || cardListName.Length > 32)
        {
            return new Error("InvalidCardListName", ErrorType.BadRequest, "The CardList name must contain between 1-32 characters!");
        }

        return Result.Success();
    }

    public static Result<CardList> Create(int boardId, string cardListName, string? prevPosition)
    {
        Result validateCardListNameResult = ValidateCardListName(cardListName);
        return validateCardListNameResult.IsSuccess ? new CardList(boardId, cardListName, 
            LexicalOrderHelper.GetBetween(prevPosition, null)) : validateCardListNameResult.Error!;
    }
    
    public Result MoveCardList(string? prevLocation, string? nextLocation)
    {
        Result moveResult = Move(prevLocation, nextLocation);
        return moveResult.IsSuccess ? Result.Success() : moveResult;
    }

    public Result ChangeCardListName(string cardListName)
    {
        Result validateCardListNameResult = ValidateCardListName(cardListName);
        if (!validateCardListNameResult.IsSuccess) return validateCardListNameResult;
        
        CardListName = cardListName;
        return Result.Success();
    }

    public void ClearCards()
    {
        _cards.Clear();
    }
}    