using ArhiTodo.Domain.Entities.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Kanban;

public class ChecklistConfiguration : IEntityTypeConfiguration<Checklist>
{
    public void Configure(EntityTypeBuilder<Checklist> builder)
    {
        builder.HasKey(cl => cl.ChecklistId);

        builder.Property(cl => cl.ChecklistName)
            .IsRequired()
            .HasMaxLength(90);

        builder.HasMany(cl => cl.ChecklistItems);

        builder.HasOne(cl => cl.Card)
            .WithMany(c => c.Checklists)
            .HasForeignKey(cl => cl.CardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}