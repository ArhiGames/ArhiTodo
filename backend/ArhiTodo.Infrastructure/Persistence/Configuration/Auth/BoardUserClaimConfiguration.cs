using ArhiTodo.Domain.Entities.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Auth;

public class BoardUserClaimConfiguration : IEntityTypeConfiguration<BoardUserClaim>
{
    public void Configure(EntityTypeBuilder<BoardUserClaim> builder)
    {
        builder.HasKey(buc => new { buc.Type, buc.BoardId, buc.UserId });

        builder.Property(buc => buc.Type)
            .HasMaxLength(32);
        
        builder.Property(buc => buc.Value)
            .HasMaxLength(32);

        builder.HasOne(buc => buc.Board)
            .WithMany(b => b.BoardUserClaims)
            .HasForeignKey(buc => buc.BoardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(buc => buc.User)
            .WithMany(u => u.BoardUserClaims)
            .HasForeignKey(buc => buc.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}