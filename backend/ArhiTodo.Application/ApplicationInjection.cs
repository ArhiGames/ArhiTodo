using ArhiTodo.Application.Services.Implementations;
using ArhiTodo.Application.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ArhiTodo.Application;

public static class ApplicationInjection
{
    public static void AddApplicationLayer(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<IProjectService, ProjectService>();
        builder.Services.AddScoped<IBoardService, BoardService>();
        builder.Services.AddScoped<ICardListService, CardListService>();
        builder.Services.AddScoped<ICardService, CardService>();
        builder.Services.AddScoped<ILabelService, LabelService>();
        builder.Services.AddScoped<IChecklistService, ChecklistService>();
    }
}