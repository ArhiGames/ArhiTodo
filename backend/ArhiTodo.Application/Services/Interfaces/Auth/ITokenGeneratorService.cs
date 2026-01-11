namespace ArhiTodo.Application.Services.Interfaces.Auth;

public interface ITokenGeneratorService
{
    public string Hash(byte[] bytes, int size);
    public string GenerateSecureHash(int size);
    bool Verify(string hashed, string unhashed, int size);
}