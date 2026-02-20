using ArhiTodo.Domain.Entities.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Kanban;

public class CardConfiguration : IEntityTypeConfiguration<Card>
{
    public void Configure(EntityTypeBuilder<Card> builder)
    {
        builder.HasKey(c => c.CardId);

        builder.Property(c => c.CardName)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasMany(c => c.AssignedUsers)
            .WithOne(asu => asu.Card)
            .HasForeignKey(asu => asu.CardId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(c => c.CardList)
            .WithMany(cl => cl.Cards)
            .HasForeignKey(c => c.CardListId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.Labels);
        builder.HasMany(c => c.Checklists)
            .WithOne(cl => cl.Card)
            .HasForeignKey(cl => cl.CardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}