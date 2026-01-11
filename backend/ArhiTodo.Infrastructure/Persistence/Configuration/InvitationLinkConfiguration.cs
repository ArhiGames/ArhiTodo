using ArhiTodo.Domain.Entities.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration;

public class InvitationLinkConfiguration : IEntityTypeConfiguration<InvitationLink>
{
    public void Configure(EntityTypeBuilder<InvitationLink> builder)
    {
        builder.HasKey(il => il.InvitationLinkId);

        builder.HasIndex(il => il.InvitationKey)
            .IsUnique();
        builder.Property(il => il.InvitationKey)
            .IsRequired()
            .HasMaxLength(32);

        builder.Property(il => il.CreatedDate)
            .IsRequired();
        
        builder.Property(il => il.ExpiresDate)
            .IsRequired();

        builder.Property(il => il.CreatedByUser)
            .IsRequired()
            .HasMaxLength(256);
    }
}