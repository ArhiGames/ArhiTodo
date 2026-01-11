using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Services.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace ArhiTodo.Infrastructure.Services;

public class JwtTokenGeneratorService : IJwtTokenGeneratorService
{
    private readonly IConfiguration _configuration;
    private readonly SymmetricSecurityKey _securityKey;
    
    public JwtTokenGeneratorService(IConfiguration configuration)
    {
        _configuration = configuration;
        _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"]!));
    }
    
    public string GenerateToken(User user, IList<Claim> claims)
    {
        claims.Add(new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()));
        claims.Add(new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName));

        SigningCredentials signingCredentials = new(_securityKey, SecurityAlgorithms.HmacSha512Signature);
        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Subject = new ClaimsIdentity(claims),
            Issuer = _configuration["JWT:Issuer"],
            Audience = _configuration["JWT:Audience"],
            SigningCredentials = signingCredentials,
            Expires = DateTime.UtcNow.AddDays(1)
        };

        JwtSecurityTokenHandler tokenHandler = new();
        SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(securityToken);
    }
}