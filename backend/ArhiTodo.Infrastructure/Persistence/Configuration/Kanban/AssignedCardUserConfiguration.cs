using ArhiTodo.Domain.Entities.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Kanban;

public class AssignedCardUserConfiguration : IEntityTypeConfiguration<AssignedCardUser>
{
    public void Configure(EntityTypeBuilder<AssignedCardUser> builder)
    {
        builder.HasKey(asu => new { asu.CardId, asu.UserId });

        builder.HasOne(asu => asu.User)
            .WithMany()
            .HasForeignKey(asu => asu.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(asu => asu.Card)
            .WithMany()
            .HasForeignKey(asu => asu.CardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}