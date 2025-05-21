using System;
using System.Collections.Generic;

namespace Bagstore.Core.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public string Category { get; set; }
        public bool IsAvailable { get; set; }
        public int StockQuantity { get; set; }
        public List<string> Colors { get; set; }
        public List<string> Sizes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 