using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Authentication;


public interface IPasswordAuthorizer
{
    Result VerifyPasswordSecurity(string password);
}