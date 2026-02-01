using ArhiTodo.Domain.Entities.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Auth;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.UserId);

        builder.HasMany(u => u.OwningProjects);
        builder.HasMany(u => u.OwningBoards);
        builder.HasMany(u => u.UserClaims);
        builder.HasMany(u => u.UserSessions);
        builder.HasMany(u => u.BoardUserClaims);
        builder.HasMany(u => u.ProjectManagers);

        builder.HasIndex(u => u.UserName)
            .IsUnique();

        builder.Property(u => u.UserName)
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(u => u.HashedPassword)
            .IsRequired();
    }
}