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
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            var existingUser = await _userRepository.GetByEmailAsync(user.Email);
            if (existingUser != null)
                return BadRequest("Email already exists");

            var createdUser = await _userRepository.CreateAsync(user);
            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, User user)
        {
            if (id != user.Id)
                return BadRequest();

            var existingUser = await _userRepository.GetByIdAsync(id);
            if (existingUser == null)
                return NotFound();

            var updatedUser = await _userRepository.UpdateAsync(user);
            return Ok(updatedUser);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result = await _userRepository.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPut("{id}/password")]
        public async Task<IActionResult> UpdatePassword(Guid id, [FromBody] string passwordHash)
        {
            var result = await _userRepository.UpdatePasswordAsync(id, passwordHash);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{userId}/wishlist/{productId}")]
        public async Task<IActionResult> AddToWishlist(Guid userId, Guid productId)
        {
            var result = await _userRepository.AddToWishlistAsync(userId, productId);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{userId}/wishlist/{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(Guid userId, Guid productId)
        {
            var result = await _userRepository.RemoveFromWishlistAsync(userId, productId);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("{userId}/wishlist")]
        public async Task<ActionResult<IEnumerable<Product>>> GetWishlist(Guid userId)
        {
            var products = await _userRepository.GetWishlistAsync(userId);
            return Ok(products);
        }
    }
} 