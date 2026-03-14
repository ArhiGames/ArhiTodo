namespace ArhiTodo.Application.DTOs.Auth;

public class InvitationLinkGetDto
{
    public int InvitationLinkId { get; init; }

    public string InvitationKey { get; init; } = string.Empty;

    public string InvitationLinkName { get; init; } = string.Empty;

    public DateTimeOffset CreatedDate { get; init; }
    public DateTimeOffset ExpiresDate { get; init; }

    public int DefaultInvitationClaims { get; init; }
    
    public int MaxUses { get; init; }
    public int Uses { get; init; }
    
    public bool IsActive { get; init; }
    
    public PublicUserGetDto CreatedByUser { get; init; }
}