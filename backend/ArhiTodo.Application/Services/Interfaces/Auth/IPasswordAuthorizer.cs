using ArhiTodo.Domain.Entities.Lib;

namespace ArhiTodo.Application.Services.Interfaces.Auth;

public record PasswordAuthorizerResult(bool Succeeded, List<Error> Errors);

public interface IPasswordAuthorizer
{
    PasswordAuthorizerResult VerifyPasswordSecurity(string password);
}