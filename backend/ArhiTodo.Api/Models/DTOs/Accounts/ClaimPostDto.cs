using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Accounts;

public class ClaimPostDto
{
    [Required]
    public required string Type  { get; set; }
    [Required]
    public required string Value  { get; set; }
}