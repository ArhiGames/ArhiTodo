using System.Text;
using ArhiTodo.Application;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Infrastructure;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration["FrontendSettings:BaseUrl"]!)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.AddSignalR();

builder.Services.AddHttpContextAccessor();
builder.AddInfrastructureLayer();
builder.AddApplicationLayer();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie("AuthRefreshCookie", options =>
    {
        options.Cookie.Name = "AuthRefreshCookie";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Lax;

        options.LoginPath = "/auth/login";
        options.LogoutPath = "/auth/logout";
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"]!))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                string? accessToken = context.Request.Query["access_token"];

                string path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWith("/hub/"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    })
    .AddJwtBearer("JwtUnvalidatedLifetime", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"]!))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddAuthorizationBuilder()
    .AddPolicy(nameof(UserClaimTypes.CreateProjects), policy =>
    {
        policy.RequireClaim(nameof(UserClaimTypes.CreateProjects), "true");
    })
    .AddPolicy(nameof(UserClaimTypes.AccessAdminDashboard), policy =>
    {
        policy.RequireClaim(nameof(UserClaimTypes.AccessAdminDashboard), "true");
    })
    .AddPolicy(nameof(UserClaimTypes.ManageUsers), policy =>
    {
        policy.RequireClaim(nameof(UserClaimTypes.AccessAdminDashboard), "true");
        policy.RequireClaim(nameof(UserClaimTypes.ManageUsers), "true");
    })
    .AddPolicy(nameof(UserClaimTypes.DeleteUsers), policy =>
    {
        policy.RequireClaim(nameof(UserClaimTypes.AccessAdminDashboard), "true");
        policy.RequireClaim(nameof(UserClaimTypes.DeleteUsers), "true");
    })
    .AddPolicy(nameof(UserClaimTypes.InviteOtherUsers), policy =>
    {
        policy.RequireClaim(nameof(UserClaimTypes.AccessAdminDashboard), "true");
        policy.RequireClaim(nameof(UserClaimTypes.InviteOtherUsers), "true");
    })
    .AddPolicy(nameof(UserClaimTypes.UpdateAppSettings), policy =>
    {
        policy.RequireClaim(nameof(UserClaimTypes.AccessAdminDashboard), "true");
        policy.RequireClaim(nameof(UserClaimTypes.UpdateAppSettings), "true");
    })
    .AddPolicy(nameof(UserClaimTypes.ModifyOthersProjects), policy =>
    {
        policy.RequireClaim(nameof(UserClaimTypes.ModifyOthersProjects), "true");
    });

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "JWT Authorization header using the Bearer scheme."
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("bearer", document)] = []
    });
});

WebApplication app = builder.Build();

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

app.RegisterInfrastructureApp();

app.Run();