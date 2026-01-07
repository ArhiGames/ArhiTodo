using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Accounts;

public class ChangePasswordDto
{
    [Required]
    [MinLength(8)]
    public required string OldPassword { get; set; }
    
    [Required]
    [MinLength(8)]
    public required string NewPassword { get; set; }
}