namespace ArhiTodo.Application.Services.Interfaces.Authentication;

public interface ICurrentUser
{
    bool IsAuthenticated { get; }
    
    Guid UserId { get; }
}