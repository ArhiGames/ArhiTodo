using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Lib;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class PasswordAuthorizer : IPasswordAuthorizer
{
    private readonly int _requiredDigits;
    private readonly bool _requireUppercase;
    private readonly bool _requireNonAlphaNumeric;
    private readonly bool _requireDigit;

    public PasswordAuthorizer(ILogger<PasswordAuthorizer> logger, IConfiguration configuration)
    {
        string? requiredDigitsStr = configuration["Auth:Password:RequiredDigits"];
        _requiredDigits = requiredDigitsStr == null ? 5 : int.Parse(requiredDigitsStr);
        if (requiredDigitsStr == null)
        {
            logger.LogWarning("Did not provide Auth:Password:RequiredDigits in the 'appsettings.json' file! Set the default to five");
        }
        
        string? requireUppercaseStr = configuration["Auth:Password:RequireUppercase"];
        _requireUppercase = requireUppercaseStr?.ToLower() is "true";
        
        string? requireNonAlphaNumericStr = configuration["Auth:Password:RequireNonAlphaNumeric"];
        _requireNonAlphaNumeric = requireNonAlphaNumericStr?.ToLower() is "true";        
        
        string? requireDigitStr = configuration["Auth:Password:RequireDigit"];
        _requireDigit = requireDigitStr?.ToLower() is "true";
    }
    
    public PasswordAuthorizerResult VerifyPasswordSecurity(string password)
    {
        bool containsWhiteSpace = password.Contains(' ');
        bool hasRequiredDigitAmount = password.Length >= _requiredDigits;
        bool hasUppercase = !_requireUppercase || password.Any(char.IsUpper);
        bool hasNonAlphaNumeric = !_requireNonAlphaNumeric || password.Any(character => !char.IsLetterOrDigit(character));
        bool hasDigit = !_requireDigit || password.Any(char.IsDigit);

        bool succeeded = !containsWhiteSpace && hasRequiredDigitAmount && hasUppercase && hasNonAlphaNumeric &&
                         hasDigit;

        List<Error> errors = new();
        if (containsWhiteSpace) errors.Add(new Error("MustContainWhiteSpaces", "White spaces are not allowed in passwords!"));
        if (!hasRequiredDigitAmount) errors.Add(new Error("RequiresDigitAmount", $"The password is required to contain at least {_requiredDigits} characters!"));
        if (!hasUppercase) errors.Add(new Error("RequiresUppercase", "The password is required to contain at least one uppercase letter!"));
        if (!hasNonAlphaNumeric) errors.Add(new Error("RequiresNonAlphaNumeric", "The password is required to contain at least one non alpha numeric character!"));
        if (!hasDigit) errors.Add(new Error("RequiresDigit", "The password is required to contain at least one digit!"));
        return new PasswordAuthorizerResult(succeeded, errors);
    }
}