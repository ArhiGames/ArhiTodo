using ArhiTodo.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration;

public class CardLabelConfiguration : IEntityTypeConfiguration<CardLabel>
{
    public void Configure(EntityTypeBuilder<CardLabel> builder)
    {
        builder.HasKey(cl => new { cl.CardId, cl.LabelId });

        builder.HasOne(cl => cl.Card)
            .WithMany(c => c.CardLabels)
            .HasForeignKey(cl => cl.CardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}