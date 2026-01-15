using ArhiTodo.Application.Services.Implementations.Auth;
using ArhiTodo.Application.Services.Implementations.Kanban;
using ArhiTodo.Application.Services.Interfaces.Auth;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ArhiTodo.Application;

public static class ApplicationInjection
{
    public static void AddApplicationLayer(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<ITokenGeneratorService, TokenGeneratorService>();
        
        builder.Services.AddScoped<IProjectService, ProjectService>();
        builder.Services.AddScoped<IBoardService, BoardService>();
        builder.Services.AddScoped<ICardListService, CardListService>();
        builder.Services.AddScoped<ICardService, CardService>();
        builder.Services.AddScoped<ILabelService, LabelService>();
        builder.Services.AddScoped<IChecklistService, ChecklistService>();
    }
}