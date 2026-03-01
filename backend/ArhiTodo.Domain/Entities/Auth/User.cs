using System.Security.Claims;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.ValueObjects;

namespace ArhiTodo.Domain.Entities.Auth;

[Flags]
public enum UserClaimTypes
{
    CreateProjects = 1 << 0,
    UnusedUserClaimType = 1 << 1, //AccessAdminDashboard
    ManageUsers = 1 << 2,
    DeleteUsers = 1 << 3,
    InviteOtherUsers = 1 << 4,
    UpdateAppSettings = 1 << 5
}

public class User
{
    public Guid UserId { get; init; } = Guid.NewGuid();

    public DateTimeOffset CreatedAt { get; init;  } = DateTimeOffset.UtcNow;

    public string UserName { get; private set; } = string.Empty;

    public Email Email { get; private set; } = null!;

    public string HashedPassword { get; private set; } = string.Empty;

    public string? JoinedViaInvitationKey { get; private set; } = string.Empty;

    public int UserClaims { get; private set; }
    
    private readonly List<UserSession> _userSessions = [];
    public IReadOnlyCollection<UserSession> UserSessions => _userSessions.Where(us => us.ExpiresAt > DateTimeOffset.UtcNow).ToList();
    
    private User() { }

    private User(string userName, Email email, string hashedPassword, string? joinedViaInvitationKey = null)
    {
        UserName = userName;
        Email = email;
        HashedPassword = hashedPassword;
        JoinedViaInvitationKey = joinedViaInvitationKey;
    }
    
    private static Result ValidateUserName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 3 || name.Length > 20)
        {
            return new Error("InvalidUserName", ErrorType.BadRequest, "The username must contain between 3-20 characters!");
        }

        return Result.Success();
    }

    public static Result<User> Create(string userName, Email email, string hashedPassword, string? joinedViaInvitationKey = null)
    {
        Result validateUserNameResult = ValidateUserName(userName);
        return validateUserNameResult.IsSuccess
            ? new User(userName, email, hashedPassword, joinedViaInvitationKey)
            : validateUserNameResult.Error!;
    }

    public void AddAdminUserClaims()
    {
        UserClaims = 0;
        foreach (UserClaimTypes userClaimType in Enum.GetValuesAsUnderlyingType<UserClaimTypes>())
        {
            UserClaims |= (int)userClaimType;
        }
    }
    
    public Result ChangeClaimValue(UserClaimTypes userClaimTypes, bool value)
    {
        if (UserName == "admin")
        {
            return new Error("ChangingAdminUserClaims", ErrorType.Conflict,
                "You cannot edit the admin user!");
        }

        if (value)
        {
            UserClaims |= (int)userClaimTypes;
        }
        else
        {
            UserClaims &= ~(int)userClaimTypes;
        }
        return Result.Success();
    }

    public void ChangePassword(string hashedPassword)
    {
        HashedPassword = hashedPassword;
    }

    public Result AddUserSession(UserSession userSession)
    {
        if (_userSessions.Exists(us => us.TokenHash == userSession.TokenHash || us.UserAgent == userSession.UserAgent))
        {
            return new Error("ConflictingSession", ErrorType.Conflict,
                "There is already a session with the exact same token hash or user agent!");
        }
        _userSessions.Add(userSession);
        return Result.Success();
    }

    public Result RemoveUserSession(string userAgent)
    {
        UserSession? foundUserSession = _userSessions.FirstOrDefault(us => us.UserAgent == userAgent);
        if (foundUserSession is null)
        {
            return new Error("NoSessionToRemove", ErrorType.Conflict,
                "There is now user on this user with the specified user agent, nothing to remove!");
        }
        return _userSessions.Remove(foundUserSession) ? Result.Success() : Errors.Unknown;
    }

    public List<Claim> GetUserClaimsAsList()
    {
        List<Claim> claims = [];
        foreach (UserClaimTypes userClaimType in Enum.GetValuesAsUnderlyingType<UserClaimTypes>())
        {
            bool hasClaim = (UserClaims & (int)userClaimType) != 0;
            if (hasClaim)
            {
                claims.Add(new Claim(userClaimType.ToString(), true.ToString()));
            }
        }
        return claims;
    }

    public void ClearUserSessions()
    {
        _userSessions.Clear();
    }
}