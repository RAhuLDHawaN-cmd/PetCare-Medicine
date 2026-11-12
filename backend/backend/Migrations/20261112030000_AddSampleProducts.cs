using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class AddSampleProducts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "Title", "Description", "Quantity", "ImageUrl", "CreatedAt", "UpdatedAt" },
                values: new object[,]
                {
                    { 1L, "KONG", "KONG Classic", "Red natural-rubber dog toy for stuffing with treats and encouraging enrichment through an unpredictable bounce.", 1, "/uploads/kong-classic.jpg", new DateTime(2026, 11, 12), new DateTime(2026, 11, 12) },
                    { 2L, "KONG", "KONG Extreme", "Black natural-rubber toy designed for determined chewers; stuff with treats to make play last longer.", 1, "/uploads/kong-extreme.png", new DateTime(2026, 11, 12), new DateTime(2026, 11, 12) },
                    { 3L, "KONG", "KONG Wobbler", "A red treat-dispensing dog toy that rocks and rolls when nudged, adding activity to snack time.", 1, "/uploads/kong-wobbler.jpg", new DateTime(2026, 11, 12), new DateTime(2026, 11, 12) },
                    { 4L, "KONG", "Naturals Scratcher Double", "Reversible cardboard cat scratcher supplied with catnip to encourage scratching on its surface.", 1, "/uploads/kong-scratcher.jpg", new DateTime(2026, 11, 12), new DateTime(2026, 11, 12) },
                    { 5L, "KONG", "ZoomGroom Boysenberry", "Flexible TPE dog grooming brush with rubber fingers for brushing dry coats or shampooing during bath time.", 1, "/uploads/kong-zoomgroom.jpg", new DateTime(2026, 11, 12), new DateTime(2026, 11, 12) }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValues: new object[] { 1L, 2L, 3L, 4L, 5L });
        }
    }
}
