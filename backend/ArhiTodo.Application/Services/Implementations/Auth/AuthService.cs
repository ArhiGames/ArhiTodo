using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories;
using ArhiTodo.Domain.Services.Auth;

namespace ArhiTodo.Application.Services.Implementations.Auth;

public class AuthService(IUserRepository userRepository, IPasswordHash passwordHash) : IAuthService
{
    public async Task<bool> CreateAccount(CreateAccountDto createAccountDto)
    {
        string hashedPassword = passwordHash.Hash(createAccountDto.Password);

        User user = new()
        {
            UserName = createAccountDto.Username,
            HashedPassword = hashedPassword
        };

        User? createdUser = await userRepository.CreateUserAsync(user);
        return createdUser != null;
    }
}