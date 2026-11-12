using backend.Context;
using backend.Dtos;
using backend.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private const long MaxImageBytes = 5 * 1024 * 1024;
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProductsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // CRUD -> Create - Read - Update - Delete

        // Create
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateUpdateProductDto dto)
        {
            var newProduct = new ProductEntity()
            {
                Brand = dto.Brand,
                Title = dto.Title,
                Description = dto.Description,
                Quantity = dto.Quantity,
            };

            await _context.Products.AddAsync(newProduct);
            await _context.SaveChangesAsync();

            return Ok("Product Saved Successfully");
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateProductWithImage([FromForm] ProductUploadDto dto)
        {
            var imageError = ValidateImage(dto.Image);
            if (imageError is not null)
            {
                return BadRequest(imageError);
            }

            var product = new ProductEntity
            {
                Brand = dto.Brand,
                Title = dto.Title,
                Description = dto.Description,
                Quantity = dto.Quantity
            };

            if (dto.Image is not null)
            {
                product.ImageUrl = await SaveImageAsync(dto.Image);
            }

            try
            {
                await _context.Products.AddAsync(product);
                await _context.SaveChangesAsync();
            }
            catch
            {
                DeleteImage(product.ImageUrl);
                throw;
            }

            return Ok("Product Saved Successfully");
        }

        // Read
        [HttpGet]
        public async Task<ActionResult<List<ProductEntity>>> GetAllProducts()
        {
            var products = await _context.Products.OrderByDescending(q => q.UpdatedAt).ToListAsync();

            return Ok(products);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<ProductEntity>> GetProductByID([FromRoute] long id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(q => q.Id == id);

            if(product is null)
            {
                return NotFound("Product Not Found");
            }

            return Ok(product);
        }

        // Update
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UdpateProduct([FromRoute] long id, [FromBody] CreateUpdateProductDto dto)
        {
            var product = await _context.Products.FirstOrDefaultAsync(q => q.Id == id);

            if (product is null)
            {
                return NotFound("Product Not Found");
            }

            product.Title = dto.Title;
            product.Description = dto.Description;
            product.Brand = dto.Brand;
            product.Quantity = dto.Quantity;
            product.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Product Updated Successfully");
        }

        [HttpPut("upload/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateProductWithImage([FromRoute] long id, [FromForm] ProductUploadDto dto)
        {
            var product = await _context.Products.FirstOrDefaultAsync(q => q.Id == id);
            if (product is null)
            {
                return NotFound("Product Not Found");
            }

            var imageError = ValidateImage(dto.Image);
            if (imageError is not null)
            {
                return BadRequest(imageError);
            }

            var previousImageUrl = product.ImageUrl;
            var replacementImageUrl = dto.Image is null ? null : await SaveImageAsync(dto.Image);

            product.Title = dto.Title;
            product.Description = dto.Description;
            product.Brand = dto.Brand;
            product.Quantity = dto.Quantity;
            if (replacementImageUrl is not null)
            {
                product.ImageUrl = replacementImageUrl;
            }
            product.UpdatedAt = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch
            {
                DeleteImage(replacementImageUrl);
                throw;
            }

            if (replacementImageUrl is not null)
            {
                DeleteImage(previousImageUrl);
            }

            return Ok("Product Updated Successfully");
        }

        // Delete
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteProduct([FromRoute] long id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(q => q.Id == id);

            if (product is null)
            {
                return NotFound("Product Not Found");
            }

            var imageUrl = product.ImageUrl;
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            DeleteImage(imageUrl);

            return Ok("Product Deleted Successfully");
        }

        private static string? ValidateImage(IFormFile? image)
        {
            if (image is null)
            {
                return null;
            }

            if (image.Length == 0 || image.Length > MaxImageBytes)
            {
                return "Choose an image smaller than 5 MB.";
            }

            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            var expectedContentType = extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".webp" => "image/webp",
                _ => null
            };

            if (expectedContentType is null || !string.Equals(image.ContentType, expectedContentType, StringComparison.OrdinalIgnoreCase))
            {
                return "Upload a JPG, PNG, or WebP image.";
            }

            return null;
        }

        private async Task<string> SaveImageAsync(IFormFile image)
        {
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            var fileName = $"{Guid.NewGuid():N}{extension}";
            var uploadsDirectory = Path.Combine(_environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot"), "uploads");
            Directory.CreateDirectory(uploadsDirectory);

            await using var stream = System.IO.File.Create(Path.Combine(uploadsDirectory, fileName));
            await image.CopyToAsync(stream);
            return $"/uploads/{fileName}";
        }

        private void DeleteImage(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl) || !imageUrl.StartsWith("/uploads/", StringComparison.Ordinal))
            {
                return;
            }

            var fileName = Path.GetFileName(imageUrl);
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return;
            }

            var uploadsDirectory = Path.Combine(_environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot"), "uploads");
            var imagePath = Path.Combine(uploadsDirectory, fileName);
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }
    }
}
