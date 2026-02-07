using System.Security.Cryptography;
using System.Text;
using ArhiTodo.Application.Services.Interfaces.Authentication;

namespace ArhiTodo.Application.Services.Implementations.Authentication;

public class TokenGeneratorService : ITokenGeneratorService
{
    public string Hash(byte[] bytes, int size)
    {
        byte[] hashedBytes = SHA512.HashData(bytes);
        string token = Convert.ToHexString(hashedBytes);
        return token;
    }

    public byte[] GenerateSecureToken(int size)
    {
        byte[] randomNumber = new byte[size];
        RandomNumberGenerator randomNumberGenerator = RandomNumberGenerator.Create();
        randomNumberGenerator.GetBytes(randomNumber);
        return randomNumber;
    }

    public bool Verify(string hashed, string unhashed, int size)
    {
        string hashedUnhashed = Hash(Encoding.UTF8.GetBytes(unhashed), size);

        byte[] hashedBytes = Encoding.UTF8.GetBytes(hashed);
        byte[] hashedUnhashedBytes = Encoding.UTF8.GetBytes(hashedUnhashed);

        return CryptographicOperations.FixedTimeEquals(hashedBytes, hashedUnhashedBytes);
    }
}