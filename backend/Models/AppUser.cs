using Microsoft.AspNetCore.Identity;

namespace ArhiTodo.Models;

public class AppUser : IdentityUser
{
    public int InvitationLinkId { get; set; }
}