using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.Invitation;

public class InvitationLink
{
    [Key]
    public int InvitationLinkId { get; set; }
    
    [Required]
    [MinLength(32)] [MaxLength(32)]
    public required string InvitationKey { get; set; }
    
    [Required]
    public required DateTimeOffset CreatedDate { get; set; }
    
    [Required]
    public required DateTimeOffset ExpiresDate { get; set; }
    
    [Required] [MaxLength(256)]
    public required string CreatedByUser { get; set; }
    
    // 0 => infinite
    [Required]
    [Range(0, 50)]
    public required int MaxUses { get; set; }

    public int Uses { get; set; } = 0;
    
    // If the invitation link is active, can be active even if the expire date has been crossed
    // Just means if someone manually deactivated this key 
    public bool IsActive { get; set; } = true;
}