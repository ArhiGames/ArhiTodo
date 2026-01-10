using ArhiTodo.Domain.Repositories;
using ArhiTodo.Infrastructure.Persistence;
using ArhiTodo.Infrastructure.Persistence.Repositories;
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
        
        /*serviceCollection.AddIdentity<AppUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequiredLength = 8;
            options.User.RequireUniqueEmail = true;
        }).AddEntityFrameworkStores<ProjectDataBase>();*/
        
        builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
        builder.Services.AddScoped<IBoardRepository, BoardRepository>();
        builder.Services.AddScoped<ICardlistRepository, CardlistRepository>();
        builder.Services.AddScoped<ICardRepository, CardRepository>();
        builder.Services.AddScoped<ILabelRepository, LabelRepository>();
        builder.Services.AddScoped<IChecklistRepository, ChecklistRepository>();
    }
}