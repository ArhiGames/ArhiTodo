using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ArhiTodo.Models.DTOs.Accounts;

public class UserUserManagementGetDto
{
    [Required] 
    public required string UserId { get; set; } = string.Empty;

    [Required] 
    public required string UserName { get; set; } = string.Empty;

    [Required] 
    [EmailAddress] 
    public required string Email { get; set; } = string.Empty;

    [Required] 
    public required List<Claim> UserClaims { get; set; } = [];
}