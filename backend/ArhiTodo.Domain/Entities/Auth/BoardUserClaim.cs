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

    public bool Value { get; private set; }
    
    public int BoardId { get; init; }
    public Board Board { get; } = null!;
    
    public Guid UserId { get; init; }
    public User User { get; } = null!;

    private BoardUserClaim() { }
    
    public BoardUserClaim(BoardClaimTypes boardClaimType, bool value, int boardId, Guid userId)
    {
        Type = boardClaimType;
        Value = value;
        BoardId = boardId;
        UserId = userId;
    }

    public void UpdateValue(bool newValue)
    {
        Value = newValue;
    }
}