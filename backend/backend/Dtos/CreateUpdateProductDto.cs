using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.Dtos
{
    public class CreateUpdateProductDto
    {
        public string Brand { get; set; }

        public string Title { get; set; }

        public string Description { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; } = 1;
    }

    public class ProductUploadDto : CreateUpdateProductDto
    {
        public IFormFile? Image { get; set; }
    }
}
