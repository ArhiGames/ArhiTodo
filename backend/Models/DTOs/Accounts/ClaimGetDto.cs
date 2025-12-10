using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Accounts;

public class ClaimGetDto
{
    [Required] 
    public required string Type { get; set; } = string.Empty;

    [Required] 
    public required string Value { get; set; } = string.Empty;
}