namespace ArhiTodo.Domain.Entities.Auth;

public class InvitationLink
{
    public int InvitationLinkId { get; private set; }

    public string InvitationKey { get; private set; } = string.Empty;

    public string InvitationLinkName { get; private set; } = string.Empty;

    public DateTimeOffset CreatedDate { get; init; } = DateTimeOffset.UtcNow;
    
    public DateTimeOffset ExpiresDate { get; private set; }
    
    // 0 => infinite
    public int MaxUses { get; private set; }

    public int Uses { get; private set; }
    
    // If the invitation link is active, can be active even if the expire date has been crossed
    // Just means if someone manually deactivated this key 
    public bool IsActive { get; private set; } = true;
    
    public Guid CreatedByUserId { get; private set; }
    public User CreatedByUser { get; } = null!;

    private InvitationLink() { }
    
    public InvitationLink(string invitationKey, string invitationLinkName, int maxUses, DateTimeOffset expiresDate, Guid createdByUserId)
    {
        InvitationKey = invitationKey;
        InvitationLinkName = invitationLinkName;
        MaxUses = maxUses;
        ExpiresDate = expiresDate;
        CreatedByUserId = createdByUserId;
    }

    public void Use()
    {
        if (Uses >= MaxUses)
        {
            throw new InvitationLinkOverused();
        }

        Uses++;
    }

    public void Deactivate()
    {
        IsActive = false;
    }
}