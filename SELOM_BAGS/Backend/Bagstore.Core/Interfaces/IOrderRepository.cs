using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Bagstore.Core.Models;

namespace Bagstore.Core.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetByIdAsync(Guid id);
        Task<IEnumerable<Order>> GetByUserIdAsync(Guid userId);
        Task<Order> CreateAsync(Order order);
        Task<Order> UpdateAsync(Order order);
        Task<bool> UpdateStatusAsync(Guid id, string status);
        Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTime start, DateTime end);
        Task<IEnumerable<Order>> GetPendingOrdersAsync();
        Task<decimal> GetTotalRevenueAsync(DateTime start, DateTime end);
    }
} 