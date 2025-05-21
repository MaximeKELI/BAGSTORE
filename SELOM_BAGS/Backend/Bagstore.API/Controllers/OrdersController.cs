using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Bagstore.Core.Models;
using Bagstore.Core.Interfaces;

namespace Bagstore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;

        public OrdersController(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(Guid id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders(Guid userId)
        {
            var orders = await _orderRepository.GetByUserIdAsync(userId);
            return Ok(orders);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(Order order)
        {
            var createdOrder = await _orderRepository.CreateAsync(order);
            return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(Guid id, Order order)
        {
            if (id != order.Id)
                return BadRequest();

            var existingOrder = await _orderRepository.GetByIdAsync(id);
            if (existingOrder == null)
                return NotFound();

            var updatedOrder = await _orderRepository.UpdateAsync(order);
            return Ok(updatedOrder);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] string status)
        {
            var result = await _orderRepository.UpdateStatusAsync(id, status);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByDateRange(
            [FromQuery] DateTime start,
            [FromQuery] DateTime end)
        {
            var orders = await _orderRepository.GetOrdersByDateRangeAsync(start, end);
            return Ok(orders);
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<Order>>> GetPendingOrders()
        {
            var orders = await _orderRepository.GetPendingOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("revenue")]
        public async Task<ActionResult<decimal>> GetTotalRevenue(
            [FromQuery] DateTime start,
            [FromQuery] DateTime end)
        {
            var revenue = await _orderRepository.GetTotalRevenueAsync(start, end);
            return Ok(revenue);
        }
    }
} 