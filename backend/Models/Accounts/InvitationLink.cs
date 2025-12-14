using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models.Accounts;

public class InvitationLink
{
    [Key]
    public int InvitationLinkId { get; set; }
    
    [Required]
    [MinLength(16)] [MaxLength(16)]
    public required string InvitationKey { get; set; }
    
    [Required]
    public DateTime CreatedDate { get; } = DateTime.UtcNow;
    
    [Required]
    public required DateTime ExpiresDate { get; set; }
    
    [Required] [MaxLength(256)]
    public required string CreatedByUser { get; set; }
    
    // If the invitation link is active, can be active even if the expire date has been crossed
    // Just means if someone manually deactivated this key 
    public bool IsActive { get; set; } = true;
}