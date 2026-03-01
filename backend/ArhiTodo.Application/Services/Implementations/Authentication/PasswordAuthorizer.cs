using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ArhiTodo.Application.Services.Implementations.Authentication;

public class PasswordAuthorizer : IPasswordAuthorizer
{
    private readonly int _requiredDigits;
    private readonly bool _requireUppercase;
    private readonly bool _requireNonAlphaNumeric;
    private readonly bool _requireDigit;

    public PasswordAuthorizer(ILogger<PasswordAuthorizer> logger, IConfiguration configuration)
    {
        string? requiredDigitsStr = configuration["Auth:Password:RequiredDigits"];
        _requiredDigits = requiredDigitsStr is null ? 5 : int.Parse(requiredDigitsStr);
        if (requiredDigitsStr is null)
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
    
    public Result VerifyPasswordSecurity(string password)
    {
        bool containsWhiteSpace = password.Contains(' ');
        bool hasRequiredDigitAmount = password.Length >= _requiredDigits;
        bool hasUppercase = !_requireUppercase || password.Any(char.IsUpper);
        bool hasNonAlphaNumeric = !_requireNonAlphaNumeric || password.Any(character => !char.IsLetterOrDigit(character));
        bool hasDigit = !_requireDigit || password.Any(char.IsDigit);

        bool succeeded = !containsWhiteSpace && hasRequiredDigitAmount && hasUppercase && hasNonAlphaNumeric &&
                         hasDigit;

        if (containsWhiteSpace) return Result.Failure(new Error("MustContainWhiteSpaces", ErrorType.PasswordRequirements, 
            "White spaces are not allowed in passwords!"));
        
        if (!hasRequiredDigitAmount) return Result.Failure(new Error("RequiresDigitAmount", ErrorType.PasswordRequirements, 
            $"The password is required to contain at least {_requiredDigits} characters!"));
        
        if (!hasUppercase) return Result.Failure(new Error("RequiresUppercase", ErrorType.PasswordRequirements,
            "The password is required to contain at least one uppercase letter!"));
        
        if (!hasNonAlphaNumeric) return Result.Failure(new Error("RequiresNonAlphaNumeric", ErrorType.PasswordRequirements,
            "The password is required to contain at least one non alpha numeric character!"));
        
        if (!hasDigit) return Result.Failure(new Error("RequiresDigit", ErrorType.PasswordRequirements,
            "The password is required to contain at least one digit!"));

        return succeeded ? Result.Success() : Errors.PasswordRequirements;
    }
}