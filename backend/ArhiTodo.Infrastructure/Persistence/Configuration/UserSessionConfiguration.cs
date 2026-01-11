using ArhiTodo.Domain.Entities.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration;

public class UserSessionConfiguration : IEntityTypeConfiguration<UserSession>
{
    public void Configure(EntityTypeBuilder<UserSession> builder)
    {
        builder.HasKey(us => us.SessionId);

        builder.HasOne(us => us.User)
            .WithMany(u => u.UserSessions)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(us => us.TokenHash)
            .IsUnique();
    }
}