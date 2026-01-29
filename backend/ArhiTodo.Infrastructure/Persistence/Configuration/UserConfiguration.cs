using ArhiTodo.Domain.Entities.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.UserId);

        builder.HasMany(u => u.UserClaims);

        builder.HasIndex(u => u.UserName)
            .IsUnique();

        builder.Property(u => u.UserName)
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(u => u.HashedPassword)
            .IsRequired();
    }
}