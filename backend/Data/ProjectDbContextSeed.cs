using System.Security.Claims;
using ArhiTodo.Models;
using Microsoft.AspNetCore.Identity;

namespace ArhiTodo.Data;

public static class ProjectDbContextSeed
{
    public static async Task CreateInitialUsers(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        AppUser? adminUser = await userManager.FindByNameAsync("admin");
        if (adminUser != null) return;

        adminUser = new AppUser
        {
            UserName = "admin",
            Email = "admin@admin.admin",
            EmailConfirmed = true
        };
        
        IdentityResult identityResult = await userManager.CreateAsync(adminUser, "Admin123!");
        if (identityResult.Succeeded)
        {
            List<Claim> defaultAdminClaims =
            [
                new("create_projects", "true"),
                new("delete_others_boards", "true"),
                new("modify_others_boards", "true"),
                new("access_admin_dashboard", "true"),
                new("manage_users", "true"),
                new("delete_users", "true"),
                new("invite_other_users", "true"),
                new("update_app_settings", "true")
            ];
            await userManager.AddClaimsAsync(adminUser, defaultAdminClaims);
        }
    }
    
}