using ArhiTodo.Domain.Entities.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Kanban;

public class ChecklistItemConfiguration : IEntityTypeConfiguration<ChecklistItem>
{
    public void Configure(EntityTypeBuilder<ChecklistItem> builder)
    {
        builder.HasKey(ci => ci.ChecklistItemId);

        builder.Property(ci => ci.ChecklistItemName)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasIndex(ci => ci.IsDone);

        builder.HasOne(ci => ci.Checklist)
            .WithMany(cl => cl.ChecklistItems)
            .HasForeignKey(ci => ci.ChecklistId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}