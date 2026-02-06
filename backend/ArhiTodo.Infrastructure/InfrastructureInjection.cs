using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Domain.Repositories.Auth;
using ArhiTodo.Domain.Repositories.Common;
using ArhiTodo.Domain.Repositories.Kanban;
using ArhiTodo.Domain.Services.Auth;
using ArhiTodo.Infrastructure.Identity;
using ArhiTodo.Infrastructure.Persistence;
using ArhiTodo.Infrastructure.Persistence.Repositories.Auth;
using ArhiTodo.Infrastructure.Persistence.Repositories.Common;
using ArhiTodo.Infrastructure.Persistence.Repositories.Kanban;
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
        builder.Services.AddScoped<ICurrentUser, CurrentUser>();
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
        builder.Services.AddScoped<IBoardRepository, BoardRepository>();
        builder.Services.AddScoped<ICardRepository, CardRepository>();
        builder.Services.AddScoped<IInvitationRepository, InvitationRepository>();

        builder.Services.AddScoped<IAccountRepository, AccountRepository>();
        builder.Services.AddScoped<ISessionRepository, SessionRepository>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IJwtTokenGeneratorService, JwtTokenGeneratorService>();
        builder.Services.AddScoped<IPasswordHashService, PasswordHashService>();

        builder.Services.AddScoped<IProjectNotificationService, ProjectNotificationService>();
        builder.Services.AddScoped<IBoardNotificationService, BoardNotificationService>();
        builder.Services.AddScoped<ICardListNotificationService, CardListNotificationService>();
        builder.Services.AddScoped<ICardNotificationService, CardNotificationService>();
        builder.Services.AddScoped<IChecklistNotificationService, ChecklistNotificationService>();
        builder.Services.AddScoped<ILabelNotificationService, LabelNotificationService>();
        
        builder.Services.AddDbContext<ProjectDataBase>(options =>
        {
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
        });
    }

    public static void RegisterInfrastructureApp(this WebApplication webApplication)
    {
        webApplication.MapHub<BoardHub>("/hub/board");
    } 
}