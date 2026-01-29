using System.Reflection;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using ArhiTodo.Domain.Services.Auth;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence;

public class ProjectDataBase(DbContextOptions<ProjectDataBase> options, IPasswordHashService passwordHashService)
    : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<UserClaim> UserClaims { get; set; }
    public DbSet<UserSession> UserSessions { get; set; }
    public DbSet<InvitationLink> InvitationLinks { get; set; }
    
    public DbSet<Project> Projects { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<CardList> CardLists { get; set; }
    public DbSet<Card> Cards { get; set; }
    public DbSet<Label> Labels { get; set; }
    public DbSet<CardLabel> CardLabels { get; set; }
    
    public DbSet<Checklist> Checklists { get; set; }
    public DbSet<ChecklistItem> ChecklistItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        optionsBuilder.UseSeeding((context, _) =>
        {
            User? adminUser = context.Set<User>().FirstOrDefault(u => u.UserName == "admin");
            if (adminUser != null) return;
            
            string hashedPassword = passwordHashService.Hash("admin");
            User appUser = new()
            {
                UserName = "admin",
                Email = "admin@admin.admin",
                HashedPassword = hashedPassword
            };
            context.Set<User>().Add(appUser);
            context.SaveChanges();
        });
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}