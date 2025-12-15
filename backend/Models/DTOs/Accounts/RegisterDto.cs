using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ArhiTodo.Models.DTOs.Accounts;

public class RegisterDto
{
    [Required]
    [PersonalData]
    public required string UserName { get; set; }
    
    [Required]
    [EmailAddress]
    [ProtectedPersonalData]
    public required string Email { get; set; }
    
    [Required]
    [ProtectedPersonalData]
    public required string Password { get; set; }
    
    [Required]
    [Range(32, 32)]
    public required string InvitationKey { get; set; }
}