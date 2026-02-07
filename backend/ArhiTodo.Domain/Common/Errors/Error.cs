namespace ArhiTodo.Domain.Common.Errors;

public enum ErrorType
{
    Unknown,
    Unauthenticated,
    Forbidden,
    PasswordRequirements,
    InvalidInvitationLink,
    InvalidInput,
    NotFound,
    Conflict
}

public record Error(string Id, ErrorType ErrorType, string Description);

public static class Errors
{
    public static Error Unknown { get; } = new("Unknown", ErrorType.Unknown, "Unknown error!");

    public static Error Unauthenticated { get; } =
        new("Unauthenticated", ErrorType.Unauthenticated, "The user wasn't authenticated!");
    
    public static Error Forbidden { get; } =
        new("Forbidden", ErrorType.Forbidden, "Access forbidden due to insufficient permissions");

    public static Error PasswordRequirements { get; } = new("PasswordRequirements",
        ErrorType.PasswordRequirements, "Unknown password requirement wasn't met!");

    public static Error InvalidInvitationLink { get; } = new("InvalidInvitationLink",
        ErrorType.InvalidInvitationLink, "The used invitation link was invalid!");
     
    public static Error NotFound { get; } = new("NotFound",
        ErrorType.NotFound, "Did not find the searched for resource");
}