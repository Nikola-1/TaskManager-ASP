using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FixCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Groups_group_id",
                table: "Tasks");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Groups_group_id",
                table: "Tasks",
                column: "group_id",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Groups_group_id",
                table: "Tasks");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Groups_group_id",
                table: "Tasks",
                column: "group_id",
                principalTable: "Groups",
                principalColumn: "Id");
        }
    }
}
