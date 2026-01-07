using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ArhiTodo.Infrastructure.Identity;
using ArhiTodo.Interfaces;
using ArhiTodo.Models;
using Microsoft.IdentityModel.Tokens;

namespace ArhiTodo.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly SymmetricSecurityKey _securityKey;
    
    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
        _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"]!));
    }
    
    public string CreateToken(AppUser user, IList<Claim> claims)
    { 
        claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
        claims.Add(new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName!));
        claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email!));

        SigningCredentials credentials = new(_securityKey, SecurityAlgorithms.HmacSha512Signature);
        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = credentials,
            Issuer = _configuration["JWT:Issuer"],
            Audience = _configuration["JWT:Audience"]
        };

        JwtSecurityTokenHandler tokenHandler = new();
        SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);
        
        return tokenHandler.WriteToken(securityToken);
    }
}