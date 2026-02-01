using ArhiTodo.Domain.Entities.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Auth;

public class ProjectManagerConfiguration : IEntityTypeConfiguration<ProjectManager>
{
    public void Configure(EntityTypeBuilder<ProjectManager> builder)
    {
        builder.HasKey(pm => new { pm.UserId, pm.ProjectId });

        builder.HasOne(pm => pm.User)
            .WithMany(u => u.ProjectManagers)
            .HasForeignKey(pm => pm.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(pm => pm.Project)
            .WithMany(p => p.ProjectManagers)
            .HasForeignKey(pm => pm.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}