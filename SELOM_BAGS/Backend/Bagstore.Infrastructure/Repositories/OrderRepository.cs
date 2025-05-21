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
    public class OrderRepository : IOrderRepository
    {
        private readonly BagstoreContext _context;

        public OrderRepository(BagstoreContext context)
        {
            _context = context;
        }

        public async Task<Order> GetByIdAsync(Guid id)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.ShippingAddress)
                .Include(o => o.PaymentInfo)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<Order>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.ShippingAddress)
                .Include(o => o.PaymentInfo)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<Order> CreateAsync(Order order)
        {
            order.OrderDate = DateTime.UtcNow;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<Order> UpdateAsync(Order order)
        {
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<bool> UpdateStatusAsync(Guid id, string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return false;

            order.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTime start, DateTime end)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.OrderDate >= start && o.OrderDate <= end)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetPendingOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.ShippingAddress)
                .Where(o => o.Status == "Pending")
                .OrderBy(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalRevenueAsync(DateTime start, DateTime end)
        {
            return await _context.Orders
                .Where(o => o.OrderDate >= start && o.OrderDate <= end && o.Status == "Completed")
                .SumAsync(o => o.TotalAmount);
        }
    }
} 