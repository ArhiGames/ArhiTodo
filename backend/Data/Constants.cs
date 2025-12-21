using System.Security.Claims;

namespace ArhiTodo.Data;

public class Constants
{
    public static readonly Claim[] Claims =
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
}