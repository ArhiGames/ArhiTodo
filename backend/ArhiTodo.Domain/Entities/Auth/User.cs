using ArhiTodo.Domain.Exceptions;

namespace ArhiTodo.Domain.Entities.Auth;

public class User
{
    public Guid UserId { get; init; } = Guid.NewGuid();

    public DateTimeOffset CreatedAt { get; init;  } = DateTimeOffset.UtcNow;

    public string UserName { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public string HashedPassword { get; private set; } = string.Empty;

    public string? JoinedViaInvitationKey { get; private set; } = string.Empty;

    private readonly List<UserSession> _userSessions = [];
    public IReadOnlyCollection<UserSession> UserSessions => _userSessions;

    private readonly List<UserClaim> _userClaims = [];
    public IReadOnlyCollection<UserClaim> UserClaims => _userClaims;
    
    private User() { }

    public User(string userName, string email, string hashedPassword, string? joinedViaInvitationKey = null)
    {
        UserName = userName;
        Email = email;
        HashedPassword = hashedPassword;
        JoinedViaInvitationKey = joinedViaInvitationKey;
    }

    public void AddUserClaim(UserClaimTypes userClaimTypes, string value)
    {
        UserClaim userClaim = new(UserId, userClaimTypes, value);
        _userClaims.Add(userClaim);
    }

    public void AddUserSession(UserSession userSession)
    {
        if (_userSessions.Exists(us => us.TokenHash == userSession.TokenHash))
        {
            throw new AlreadyExistsException("User session with the exact token hash already exists for this user!");
        }
        _userSessions.Add(userSession);
    }

    public bool RemoveUserSession(string tokenHash, string userAgent)
    {
        UserSession? foundUserSession = _userSessions.FirstOrDefault(us => us.TokenHash == tokenHash && us.UserAgent == userAgent);
        if (foundUserSession == null)
        {
            throw new NothingToDeleteException(
                "There is no user session with the provided hash & user agent on this user");
        }
        return _userSessions.Remove(foundUserSession);
    }
}