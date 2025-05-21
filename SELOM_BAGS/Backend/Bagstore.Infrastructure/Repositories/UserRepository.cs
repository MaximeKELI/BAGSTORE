using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Bagstore.Core.Models;
using Bagstore.Core.Interfaces;
using Bagstore.Infrastructure.Data;

namespace Bagstore.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly BagstoreContext _context;

        public UserRepository(BagstoreContext context)
        {
            _context = context;
        }

        public async Task<User> GetByIdAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.ShippingAddresses)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.ShippingAddresses)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> CreateAsync(User user)
        {
            user.CreatedAt = DateTime.UtcNow;
            user.LastLogin = DateTime.UtcNow;
            user.IsActive = true;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            user.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePasswordAsync(Guid id, string passwordHash)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            user.PasswordHash = passwordHash;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddToWishlistAsync(Guid userId, Guid productId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            if (user.WishlistItems == null)
                user.WishlistItems = new List<Guid>();

            if (!user.WishlistItems.Contains(productId))
            {
                user.WishlistItems.Add(productId);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<bool> RemoveFromWishlistAsync(Guid userId, Guid productId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.WishlistItems == null)
                return false;

            if (user.WishlistItems.Contains(productId))
            {
                user.WishlistItems.Remove(productId);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<IEnumerable<Product>> GetWishlistAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user?.WishlistItems == null)
                return new List<Product>();

            return await _context.Products
                .Where(p => user.WishlistItems.Contains(p.Id))
                .ToListAsync();
        }
    }
} 