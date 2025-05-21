using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Bagstore.Core.Models;

namespace Bagstore.Core.Interfaces
{
    public interface IProductRepository
    {
        Task<Product> GetByIdAsync(Guid id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task<IEnumerable<Product>> GetByCategoryAsync(string category);
        Task<Product> AddAsync(Product product);
        Task<Product> UpdateAsync(Product product);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<Product>> SearchAsync(string searchTerm);
        Task<bool> UpdateStockAsync(Guid id, int quantity);
    }
} 