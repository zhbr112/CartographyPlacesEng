using CartographyPlaces.PhotoAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CartographyPlaces.AuthAPI.Data;

public class PlacePhotoDbContext : DbContext
{
    public DbSet<PlacePhoto> PlacePhoto { get; set; }

    public PlacePhotoDbContext(DbContextOptions options) : base(options)
    {
        Database.EnsureCreated();
    }
}
