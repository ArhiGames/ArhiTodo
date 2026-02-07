using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Auth;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.UserId);

        builder.Property(u => u.UserId)
            .ValueGeneratedNever();

        builder.Property(u => u.Email)
            .HasConversion(
                email => email.ToString(),
                str => Email.Create(str).Value!);

        builder.HasMany(u => u.UserClaims)
            .WithOne(uc => uc.User)
            .HasForeignKey(uc => uc.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.UserSessions)
            .WithOne(us => us.User)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(u => u.UserName)
            .IsUnique();

        builder.Property(u => u.UserName)
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(u => u.HashedPassword)
            .IsRequired();
    }
}