using System.Security.Cryptography;
using System.Text;
using ArhiTodo.Application.Services.Interfaces.Auth;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class TokenGeneratorService : ITokenGeneratorService
{
    public string Hash(byte[] bytes, int size)
    {
        byte[] hashedBytes = SHA512.HashData(bytes);
        string token = Convert.ToHexString(hashedBytes);
        return token;
    }
    
    public string GenerateSecureHash(int size)
    {
        byte[] randomNumber = new byte[32];
        RandomNumberGenerator randomNumberGenerator = RandomNumberGenerator.Create();
        randomNumberGenerator.GetBytes(randomNumber);
        return Hash(randomNumber, size);
    }

    public bool Verify(string hashed, string unhashed, int size)
    {
        string hashedUnhashed = Hash(Encoding.UTF8.GetBytes(unhashed), size);

        byte[] hashedBytes = Encoding.UTF8.GetBytes(hashed);
        byte[] hashedUnhashedBytes = Encoding.UTF8.GetBytes(hashedUnhashed);

        return CryptographicOperations.FixedTimeEquals(hashedBytes, hashedUnhashedBytes);
    }
}