using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArhiTodo.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DefaultInvitationClaims : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DefaultInvitationClaims",
                table: "InvitationLinks",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultInvitationClaims",
                table: "InvitationLinks");
        }
    }
}
