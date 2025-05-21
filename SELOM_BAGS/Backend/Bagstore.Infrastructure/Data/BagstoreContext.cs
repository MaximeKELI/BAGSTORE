using Microsoft.EntityFrameworkCore;
using Bagstore.Core.Models;

namespace Bagstore.Infrastructure.Data
{
    public class BagstoreContext : DbContext
    {
        public BagstoreContext(DbContextOptions<BagstoreContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Product configuration
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Name);

            // Order configuration
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.OrderDate);

            modelBuilder.Entity<Order>()
                .OwnsMany(o => o.Items);

            modelBuilder.Entity<Order>()
                .OwnsOne(o => o.ShippingAddress);

            modelBuilder.Entity<Order>()
                .OwnsOne(o => o.PaymentInfo);

            // User configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .OwnsMany(u => u.ShippingAddresses);
        }
    }
} 