using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Bagstore.Core.Models;

namespace Bagstore.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(Guid id);
        Task<User> GetByEmailAsync(string email);
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> UpdatePasswordAsync(Guid id, string passwordHash);
        Task<bool> AddToWishlistAsync(Guid userId, Guid productId);
        Task<bool> RemoveFromWishlistAsync(Guid userId, Guid productId);
        Task<IEnumerable<Product>> GetWishlistAsync(Guid userId);
    }
} 