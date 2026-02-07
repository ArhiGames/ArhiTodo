using System.Text.RegularExpressions;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Domain.ValueObjects;

public class Email
{
    private static readonly Regex EmailRegex = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    private readonly string _value;

    private Email(string value)
    {
        _value = value;
    }

    public static Result<Email> Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return new Error("EmptyEmail", ErrorType.BadRequest, "The email address may not be empty");
        }

        if (!EmailRegex.IsMatch(email))
        {
            return new Error("InvalidEmail", ErrorType.BadRequest,
                "The provided email address does not match the pattern of an email address!");
        }

        return new Email(email);
    }

    public override string ToString()
    {
        return _value;
    }
}