using ArhiTodo.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration;

public class CardConfiguration : IEntityTypeConfiguration<Card>
{
    public void Configure(EntityTypeBuilder<Card> builder)
    {
        builder.HasKey(c => c.CardId);

        builder.Property(c => c.CardName)
            .IsRequired()
            .HasMaxLength(90);

        builder.Property(c => c.CardDescription)
            .HasMaxLength(8192);

        builder.HasOne(c => c.CardList)
            .WithMany(cl => cl.Cards)
            .HasForeignKey(c => c.CardListId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.CardLabels);

        builder.HasMany(c => c.Checklists);
    }
}