namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface ITokenGeneratorService
{
    string Hash(byte[] bytes, int size);
    byte[] GenerateSecureToken(int size);
    bool Verify(string hashed, string unhashed, int size);
}