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
            .HasMaxLength(32);

        builder.HasOne<CardList>()
            .WithMany(cl => cl.Cards)
            .HasForeignKey(c => c.CardListId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.Labels);
        builder.HasMany(c => c.Checklists);
    }
}