using ArhiTodo.Domain.Entities.Kanban;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Kanban;

public class BoardConfiguration : IEntityTypeConfiguration<Board>
{
    public void Configure(EntityTypeBuilder<Board> builder)
    {
        builder.HasKey(b => b.BoardId);

        builder.HasOne(b => b.Owner)
            .WithMany(u => u.OwningBoards)
            .HasForeignKey(b => b.OwnedByUserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Property(b => b.BoardName)
            .IsRequired()
            .HasMaxLength(35);

        builder.HasOne<Project>()
            .WithMany(p => p.Boards)
            .HasForeignKey(b => b.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(b => b.CardLists)
            .WithOne()
            .HasForeignKey(cl => cl.BoardId);

        builder.HasMany(b => b.Labels)
            .WithOne()
            .HasForeignKey(l => l.BoardId);
    }
}