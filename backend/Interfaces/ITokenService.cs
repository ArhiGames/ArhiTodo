using ArhiTodo.Models;

namespace ArhiTodo.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user);
}