namespace ArhiTodo.Application.Services.Interfaces.Authorization;

public interface IAuthorizationService
{
    Task<bool> CheckPolicy(string policyName);
}