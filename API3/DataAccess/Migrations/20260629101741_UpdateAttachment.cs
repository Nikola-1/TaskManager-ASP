using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAttachment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TaskItemId1",
                table: "Attachments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_TaskItemId1",
                table: "Attachments",
                column: "TaskItemId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_Tasks_TaskItemId1",
                table: "Attachments",
                column: "TaskItemId1",
                principalTable: "Tasks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_Tasks_TaskItemId1",
                table: "Attachments");

            migrationBuilder.DropIndex(
                name: "IX_Attachments_TaskItemId1",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "TaskItemId1",
                table: "Attachments");
        }
    }
}
