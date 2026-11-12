using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class ProductEntity
    {
        [Key]
        public long Id { get; set; }

        public string Brand { get; set; }
        
        public string Title { get; set; }

        public string Description { get; set; } = string.Empty;

        public int Quantity { get; set; } = 1;

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

    }
}
