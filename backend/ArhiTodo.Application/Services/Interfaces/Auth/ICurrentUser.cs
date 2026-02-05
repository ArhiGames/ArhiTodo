namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface ICurrentUser
{
    bool IsAuthenticated { get; }
    
    Guid UserId { get; }
}