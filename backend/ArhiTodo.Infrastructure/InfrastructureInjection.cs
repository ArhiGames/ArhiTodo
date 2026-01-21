using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Repositories;
using ArhiTodo.Domain.Services.Auth;
using ArhiTodo.Infrastructure.Persistence;
using ArhiTodo.Infrastructure.Persistence.Repositories;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Services;
using ArhiTodo.Infrastructure.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ArhiTodo.Infrastructure;

public static class InfrastructureInjection
{
    public static void AddInfrastructureLayer(this IHostApplicationBuilder builder)
    {
        builder.Services.AddDbContext<ProjectDataBase>(options =>
        {
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
        });
        
        builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
        builder.Services.AddScoped<IBoardRepository, BoardRepository>();
        builder.Services.AddScoped<ICardlistRepository, CardlistRepository>();
        builder.Services.AddScoped<ICardRepository, CardRepository>();
        builder.Services.AddScoped<ILabelRepository, LabelRepository>();
        builder.Services.AddScoped<IChecklistRepository, ChecklistRepository>();

        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IJwtTokenGeneratorService, JwtTokenGeneratorService>();
        builder.Services.AddScoped<IPasswordHashService, PasswordHashService>();

        builder.Services.AddScoped<IBoardNotificationService, BoardNotificationService>();
    }

    public static void RegisterInfrastructureApp(this WebApplication webApplication)
    {
        webApplication.MapHub<BoardHub>("/hub/board");
    } 
}