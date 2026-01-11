namespace ArhiTodo.Domain.Services.Auth;

public interface IPasswordHash
{
    string Hash(string password);
    bool Verify(string password, string passwordHash);
}