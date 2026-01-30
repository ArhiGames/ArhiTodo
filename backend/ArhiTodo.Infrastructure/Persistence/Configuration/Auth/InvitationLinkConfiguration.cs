using ArhiTodo.Domain.Entities.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ArhiTodo.Infrastructure.Persistence.Configuration.Auth;

public class InvitationLinkConfiguration : IEntityTypeConfiguration<InvitationLink>
{
    public void Configure(EntityTypeBuilder<InvitationLink> builder)
    {
        builder.HasKey(il => il.InvitationLinkId);

        builder.Property(il => il.InvitationLinkName)
            .IsRequired()
            .HasMaxLength(32);

        builder.HasIndex(il => il.InvitationKey)
            .IsUnique();
        builder.Property(il => il.InvitationKey)
            .IsRequired();

        builder.Property(il => il.CreatedDate)
            .IsRequired();
        
        builder.Property(il => il.ExpiresDate)
            .IsRequired();

        builder.Property(il => il.CreatedByUser)
            .IsRequired()
            .HasMaxLength(256);
    }
}