using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Domain.Entities.Auth;

public class InvitationLink
{
    public int InvitationLinkId { get; private set; }

    public string InvitationKey { get; private set; } = string.Empty;

    public string InvitationLinkName { get; private set; } = string.Empty;

    public DateTimeOffset CreatedDate { get; init; } = DateTimeOffset.UtcNow;
    
    public DateTimeOffset ExpiresDate { get; private set; }
    
    // 0 => infinite
    public int MaxUses { get; init; }

    public int Uses { get; private set; }
    
    // If the invitation link is active, can be active even if the expire date has been crossed
    // Just means if someone manually deactivated this key 
    public bool IsActive { get; private set; } = true;
    
    public Guid CreatedByUserId { get; private set; }

    private InvitationLink() { }
    
    private InvitationLink(string invitationKey, string invitationLinkName, int maxUses, DateTimeOffset expiresDate, Guid createdByUserId)
    {
        InvitationKey = invitationKey;
        InvitationLinkName = invitationLinkName;
        MaxUses = maxUses;
        ExpiresDate = expiresDate;
        CreatedByUserId = createdByUserId;
    }
    
    private static Result ValidateInvitationLinkName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 1 || name.Length > 32)
        {
            return new Error("InvalidInvitationName", ErrorType.BadRequest, "The invitation link name must contain between 1-32 characters!");
        }

        return Result.Success();
    }

    public static Result<InvitationLink> Create(string invitationKey, string invitationLinkName, int maxUses,
        DateTimeOffset expiresDate, Guid createdByUserId)
    {
        Result validateInvitationLinkNameResult = ValidateInvitationLinkName(invitationLinkName);
        return validateInvitationLinkNameResult.IsSuccess
            ? new InvitationLink(invitationKey, invitationLinkName, maxUses, expiresDate, createdByUserId)
            : validateInvitationLinkNameResult.Error!;
    }

    public Result Use()
    {
        if (Uses >= MaxUses && MaxUses != 0)
        {
            return Errors.Forbidden;
        }

        Uses++;
        return Result.Success();
    }

    public void Deactivate()
    {
        IsActive = false;
    }
}