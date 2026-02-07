using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Domain.Entities.Kanban;

public class CardList
{
    public int BoardId { get; private set; }
    
    public int CardListId { get; private set; }
    public string CardListName { get; private set; } = string.Empty;

    private readonly List<Card> _cards = [];
    public IReadOnlyCollection<Card> Cards => _cards.AsReadOnly();

    private CardList() { }

    private CardList(int boardId, string cardListName)
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

    public static Result<CardList> Create(int boardId, string cardListName)
    {
        Result validateCardListNameResult = ValidateCardListName(cardListName);
        return validateCardListNameResult.IsSuccess ? new CardList(boardId, cardListName) : validateCardListNameResult.Error!;
    }

    public Result ChangeCardListName(string cardListName)
    {
        Result validateCardListNameResult = ValidateCardListName(cardListName);
        if (!validateCardListNameResult.IsSuccess) return validateCardListNameResult;
        
        CardListName = cardListName;
        return Result.Success();
    }
    
    public void AddCard(Card card)
    {
        _cards.Add(card);
    }

    public void ClearCards()
    {
        _cards.Clear();
    }
}    