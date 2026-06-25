using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGroupUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersGroups_Groups_id_group",
                table: "UsersGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_UsersGroups_Users_id_user",
                table: "UsersGroups");

            migrationBuilder.AddForeignKey(
                name: "FK_UsersGroups_Groups_id_group",
                table: "UsersGroups",
                column: "id_group",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UsersGroups_Users_id_user",
                table: "UsersGroups",
                column: "id_user",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersGroups_Groups_id_group",
                table: "UsersGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_UsersGroups_Users_id_user",
                table: "UsersGroups");

            migrationBuilder.AddForeignKey(
                name: "FK_UsersGroups_Groups_id_group",
                table: "UsersGroups",
                column: "id_group",
                principalTable: "Groups",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UsersGroups_Users_id_user",
                table: "UsersGroups",
                column: "id_user",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
