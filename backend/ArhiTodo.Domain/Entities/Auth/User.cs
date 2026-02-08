using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.ValueObjects;

namespace ArhiTodo.Domain.Entities.Auth;

public class User
{
    public Guid UserId { get; init; } = Guid.NewGuid();

    public DateTimeOffset CreatedAt { get; init;  } = DateTimeOffset.UtcNow;

    public string UserName { get; private set; } = string.Empty;

    public Email Email { get; private set; } = null!;

    public string HashedPassword { get; private set; } = string.Empty;

    public string? JoinedViaInvitationKey { get; private set; } = string.Empty;

    private readonly List<UserSession> _userSessions = [];
    public IReadOnlyCollection<UserSession> UserSessions => _userSessions.Where(us => us.ExpiresAt > DateTimeOffset.UtcNow).ToList();

    private readonly List<UserClaim> _userClaims = [];
    public IReadOnlyCollection<UserClaim> UserClaims => _userClaims;
    
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
 
    public void AddUserClaim(UserClaimTypes userClaimTypes, string value)
    {
        UserClaim userClaim = new(UserId, userClaimTypes, value);
        _userClaims.Add(userClaim);
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
        if (foundUserSession == null)
        {
            return new Error("NoSessionToRemove", ErrorType.Conflict,
                "There is now user on this user with the specified user agent, nothing to remove!");
        }
        return _userSessions.Remove(foundUserSession) ? Result.Success() : Errors.Unknown;
    }

    public void ClearUserSessions()
    {
        _userClaims.Clear();
    }
}