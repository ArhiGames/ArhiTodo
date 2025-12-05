using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Accounts;

public class UserLoginDto
{
    [Required]
    public required string UserName { get; set; } = string.Empty;
    
    [Required]
    public required string Password { get; set; } = string.Empty;
}