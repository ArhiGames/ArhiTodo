using System.Security.Claims;
using ArhiTodo.Models;

namespace ArhiTodo.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user, IList<Claim> claims);
    
}