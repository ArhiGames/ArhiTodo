using ArhiTodo.Application;
using ArhiTodo.Infrastructure;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowCredentials();
    });
});

builder.AddInfrastructureLayer();
builder.AddApplicationLayer();

builder.Services.AddAuthentication("Cookies")
    .AddCookie("Cookies", options =>
    {
        options.Cookie.Name = "access_token";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Lax;

        options.LoginPath = "/auth/login";
        options.LogoutPath = "/auth/logout";
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CreateProjects", policy =>
    {
        policy.RequireClaim("create_projects", "true");
    });
    options.AddPolicy("ManageUsers", policy =>
    {
        policy.RequireClaim("access_admin_dashboard", "true");
        policy.RequireClaim("manage_users", "true");
    });
    options.AddPolicy("DeleteUsers", policy =>
    {
        policy.RequireClaim("access_admin_dashboard", "true");
        policy.RequireClaim("delete_users", "true");
    });
    options.AddPolicy("InviteUsers", policy =>
    {
        policy.RequireClaim("access_admin_dashboard", "true");
        policy.RequireClaim("invite_other_users", "true");
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

WebApplication app = builder.Build();

/*using (IServiceScope scope = app.Services.CreateScope())
{
    IServiceProvider services = scope.ServiceProvider;
    UserManager<AppUser> userManager = services.GetRequiredService<UserManager<AppUser>>();
    await ProjectDbContextSeed.CreateInitialUsers(userManager);
}*/

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();