using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeApprovalUsage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "UserEvents");

            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Events");

            migrationBuilder.AddColumn<string>(
                name: "EventJoinApprovalStatus",
                table: "UserEvents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ClubJoinApprovalStatus",
                table: "UserClubs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EventCreateApprovalStatus",
                table: "Events",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventJoinApprovalStatus",
                table: "UserEvents");

            migrationBuilder.DropColumn(
                name: "ClubJoinApprovalStatus",
                table: "UserClubs");

            migrationBuilder.DropColumn(
                name: "EventCreateApprovalStatus",
                table: "Events");

            migrationBuilder.AddColumn<int>(
                name: "ApprovalStatus",
                table: "UserEvents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ApprovalStatus",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
