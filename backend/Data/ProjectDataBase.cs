using ArhiTodo.Models;
using ArhiTodo.Models.Invitation;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Data;

public class ProjectDataBase : IdentityDbContext<AppUser>
{
    public DbSet<Project> Projects { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<CardList> CardLists { get; set; }
    public DbSet<Card> Cards { get; set; }
    public DbSet<InvitationLink> InvitationLinks { get; set; }
    public DbSet<Label> Labels { get; set; }
    public DbSet<Checklist> Checklists { get; set; }
    public DbSet<ChecklistItem> ChecklistItems { get; set; }

    public ProjectDataBase(DbContextOptions<ProjectDataBase> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<InvitationLink>()
            .HasIndex(i => i.InvitationKey)
            .IsUnique();

        builder.Entity<Card>()
            .HasMany(c => c.CardLabels);
        builder.Entity<Card>()
            .HasMany(c => c.Checklists);

        builder.Entity<Checklist>()
            .HasMany(cl => cl.ChecklistItems);

        builder.Entity<ChecklistItem>()
            .HasIndex(ci => ci.IsDone);

        builder.Entity<CardLabel>()
            .HasKey(cl => new { cl.CardId, cl.LabelId });
        
        builder.Entity<CardLabel>()
            .HasOne(cl => cl.Card)
            .WithMany(c => c.CardLabels)
            .HasForeignKey(cl => cl.CardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}