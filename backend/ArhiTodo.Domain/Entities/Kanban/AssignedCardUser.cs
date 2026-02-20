using ArhiTodo.Domain.Entities.Auth;

namespace ArhiTodo.Domain.Entities.Kanban;

public class AssignedCardUser
{
    public int CardId { get; private set; }
    public Card Card { get; } = null!;
    
    public Guid UserId { get; private set; }
    public User User { get; } = null!;

    private AssignedCardUser() { }

    public AssignedCardUser(int cardId, Guid userId)
    {
        CardId = cardId;
        UserId = userId;
    }
}