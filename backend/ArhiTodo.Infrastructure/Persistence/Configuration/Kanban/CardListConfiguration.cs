using ArhiTodo.Domain.Entities.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Kanban;

public class CardListConfiguration : IEntityTypeConfiguration<CardList>
{
    public void Configure(EntityTypeBuilder<CardList> builder)
    {
        builder.HasKey(cl => cl.CardListId);

        builder.Property(cl => cl.CardListName)
            .IsRequired()
            .HasMaxLength(25);

        builder.HasOne(cl => cl.Board)
            .WithMany(b => b.CardLists)
            .HasForeignKey(cl => cl.BoardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(cl => cl.Cards);
    }
}