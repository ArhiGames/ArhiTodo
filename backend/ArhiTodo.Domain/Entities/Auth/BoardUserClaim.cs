using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Domain.Entities.Auth;

public enum BoardClaimTypes
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
    public BoardClaimTypes Type { get; private set; }

    public string Value { get; private set; } = string.Empty;
    
    public int BoardId { get; init; }
    public Board Board { get; } = null!;
    
    public Guid UserId { get; init; }
    public User User { get; } = null!;

    private BoardUserClaim() { }
    
    public BoardUserClaim(BoardClaimTypes boardClaimType, string value, int boardId, Guid userId)
    {
        Type = boardClaimType;
        Value = value;
        BoardId = boardId;
        UserId = userId;
    }

    public void UpdateValue(string newValue)
    {
        Value = newValue;
    }
}