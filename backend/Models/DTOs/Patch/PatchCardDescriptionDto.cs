using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Patch;

public class PatchCardDescriptionDto
{
    [MaxLength(8192)] 
    public string CardDescription { get; set; } = string.Empty;
}