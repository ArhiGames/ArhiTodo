using ArhiTodo.Domain.Entities.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Kanban;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.HasKey(p => p.ProjectId);
        builder.Property(p => p.ProjectId)
            .ValueGeneratedOnAdd();

        builder.HasOne(p => p.Owner)
            .WithMany()
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Property(p => p.ProjectName)
            .IsRequired()
            .HasMaxLength(32);

        builder.HasMany(p => p.Boards);
        builder.HasMany(p => p.ProjectManagers);
    }
}