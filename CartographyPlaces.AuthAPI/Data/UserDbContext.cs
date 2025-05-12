using CartographyPlaces.AuthAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CartographyPlaces.AuthAPI.Data;

public class UserDbContext : DbContext
{
    public DbSet<User> Users { get; set; }

    public UserDbContext(DbContextOptions options) : base(options)
    {
        Database.EnsureCreated();
    }
}
