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
            await userManager.AddClaimsAsync(adminUser, Constants.Claims);
        }
    }
    
}