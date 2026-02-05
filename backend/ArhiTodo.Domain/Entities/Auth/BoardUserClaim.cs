using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Entities.Auth;

public enum BoardClaims
{
    ManageUsers,
    ManageBoard,
    ManageCardLists,
    ManageCards,
    ManageLabels,
    ViewBoard
}

public class BoardUserClaim
{
    public string Type { get; private set; } = string.Empty;

    public string Value { get; private set; } = string.Empty;
    
    public int BoardId { get; init; }
    public Board Board { get; } = null!;
    
    public Guid UserId { get; init; }
    public User User { get; } = null!;

    private BoardUserClaim() { }
    
    public BoardUserClaim(BoardClaims boardClaim, string value, int boardId, Guid userId)
    {
        Type = boardClaim.ToString();
        Value = value;
        BoardId = boardId;
        UserId = userId;
    }

    public void UpdateValue(string newValue)
    {
        Value = newValue;
    }
}