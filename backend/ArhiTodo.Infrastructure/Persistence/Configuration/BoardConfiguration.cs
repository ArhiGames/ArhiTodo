using ArhiTodo.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration;

public class BoardConfiguration : IEntityTypeConfiguration<Board>
{
    public void Configure(EntityTypeBuilder<Board> builder)
    {
        builder.HasKey(b => b.BoardId);

        builder.Property(b => b.BoardName)
            .IsRequired()
            .HasMaxLength(35);

        builder.HasOne(b => b.Project)
            .WithMany(p => p.Boards)
            .HasForeignKey(b => b.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(b => b.CardLists)
            .WithOne(cl => cl.Board)
            .HasForeignKey(cl => cl.BoardId);

        builder.HasMany(b => b.Labels)
            .WithOne(l => l.Board)
            .HasForeignKey(l => l.BoardId);
    }
}