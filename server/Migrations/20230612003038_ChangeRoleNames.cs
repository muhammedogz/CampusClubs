using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRoleNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "UserClubs");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Users",
                newName: "UserRole");

            migrationBuilder.AddColumn<string>(
                name: "ClubRole",
                table: "UserClubs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClubRole",
                table: "UserClubs");

            migrationBuilder.RenameColumn(
                name: "UserRole",
                table: "Users",
                newName: "Role");

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "UserClubs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
