namespace ArhiTodo.Domain.Entities.Auth;

public class InvitationLink
{
    public int InvitationLinkId { get; set; }
    
    public required string InvitationKey { get; set; }

    public required string InvitationLinkName { get; set; }
    
    public required DateTimeOffset CreatedDate { get; set; }
    
    public required DateTimeOffset ExpiresDate { get; set; }
    
    public required Guid CreatedByUser { get; set; }
    
    // 0 => infinite
    public required int MaxUses { get; set; }

    public int Uses { get; set; } = 0;
    
    // If the invitation link is active, can be active even if the expire date has been crossed
    // Just means if someone manually deactivated this key 
    public bool IsActive { get; set; } = true;
}