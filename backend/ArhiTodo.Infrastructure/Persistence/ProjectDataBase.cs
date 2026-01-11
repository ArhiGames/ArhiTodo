using System.Reflection;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Entities.Kanban;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Infrastructure.Persistence;

public class ProjectDataBase : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<InvitationLink> InvitationLinks { get; set; }
    
    public DbSet<Project> Projects { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<CardList> CardLists { get; set; }
    public DbSet<Card> Cards { get; set; }
    public DbSet<Label> Labels { get; set; }
    public DbSet<CardLabel> CardLabels { get; set; }
    
    public DbSet<Checklist> Checklists { get; set; }
    public DbSet<ChecklistItem> ChecklistItems { get; set; }

    public ProjectDataBase(DbContextOptions<ProjectDataBase> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}