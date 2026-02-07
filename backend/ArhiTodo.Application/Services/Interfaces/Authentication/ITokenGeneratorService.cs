namespace ArhiTodo.Application.Services.Interfaces.Authentication;

public interface ITokenGeneratorService
{
    string Hash(byte[] bytes, int size);
    byte[] GenerateSecureToken(int size);
    bool Verify(string hashed, string unhashed, int size);
}