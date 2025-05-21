using System;
using System.Collections.Generic;

namespace Bagstore.Core.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public List<ShippingAddress> ShippingAddresses { get; set; }
        public List<Guid> WishlistItems { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastLogin { get; set; }
        public bool IsActive { get; set; }
        public string Role { get; set; }
    }
} 