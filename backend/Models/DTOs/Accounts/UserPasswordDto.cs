using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Accounts;

public class UserPasswordDto
{
    [Required]
    [MinLength(8)]
    public required string Password { get; set; }
}