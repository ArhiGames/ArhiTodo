using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.DTOs.Invitation;

public enum ExpireType
{
    Never = 0,
    Minutes = 1,
    Hours = 2,
    Days = 3
}

public class GenerateInvitationDto
{
    [Required]
    public required ExpireType ExpireType { get; set; }
    
    [Range(1, 60)]
    public int ExpireNum { get; set; }

    [Range(0, 50)] 
    public int MaxUses { get; set; } = 0;
}