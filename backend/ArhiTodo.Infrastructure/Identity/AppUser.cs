using Microsoft.AspNetCore.Identity;

namespace ArhiTodo.Infrastructure.Identity;

public class AppUser : IdentityUser
{
    public int InvitationLinkId { get; set; }
}