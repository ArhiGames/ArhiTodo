namespace ArhiTodo.Domain.Entities.Auth;

public enum UserClaimTypes
{
    CreateProjects,
    ModifyOthersProjects,
    AccessAdminDashboard,
    ManageUsers,
    DeleteUsers,
    InviteOtherUsers,
    UpdateAppSettings
}

public class UserClaim
{
    public UserClaimTypes Type { get; private set; }

    public bool Value { get; private set; }
    
    public Guid UserId { get; private set; }
    public User User { get; } = null!;
    
    private UserClaim() { }

    public UserClaim(Guid userId, UserClaimTypes type, bool value)
    {
        UserId = userId;
        Type = type;
        Value = value;
    }

    public void ChangeClaimValue(bool value)
    {
        Value = value;
    }
}