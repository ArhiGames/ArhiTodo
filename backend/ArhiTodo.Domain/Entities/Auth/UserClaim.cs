namespace ArhiTodo.Domain.Entities.Auth;

public enum UserClaimTypes
{
    CreateProjects,
    DeleteOthersBoards,
    ModifyOthersBoards,
    AccessAdminDashboard,
    ManageUsers,
    DeleteUsers,
    InviteOtherUsers,
    UpdateAppSettings
}

public class UserClaim
{
    public string Type { get; private set; } = string.Empty;

    public string Value { get; private set; } = string.Empty;
    
    public Guid UserId { get; private set; }
    public User User { get; } = null!;
    
    private UserClaim() { }

    public UserClaim(Guid userId, UserClaimTypes type, string value)
    {
        UserId = userId;
        Type = type.ToString();
        Value = value;
    }

    public void ChangeClaimValue(string value)
    {
        Value = value;
    }
}