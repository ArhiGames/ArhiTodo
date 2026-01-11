using ArhiTodo.Domain.Services.Auth;
using Microsoft.AspNetCore.Identity;

namespace ArhiTodo.Infrastructure.Services;

public class PasswordHashService : IPasswordHashService
{
    public string Hash(string password)
    {
        PasswordHasher<string> passwordHasher = new();
        string hashedPassword = passwordHasher.HashPassword("", password);
        return hashedPassword;
    }

    public bool Verify(string password, string passwordHash)
    {
        PasswordHasher<string> passwordHasher = new();
        PasswordVerificationResult passwordVerificationResult = passwordHasher.VerifyHashedPassword("", passwordHash, password);
        return passwordVerificationResult == PasswordVerificationResult.Success;
    }
}