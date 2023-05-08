// using Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Server.Models;

namespace Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(){
        
    }
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }

    // protected override void OnModelCreating(ModelBuilder modelBuilder)
    // {
    //     modelBuilder.Entity<Club>()
    //         .HasKey(c => c.ClubId);
    // }

    public DbSet<User> Users { get; set; } // create users table with 4 (category has 4) columns
    
    public DbSet<Club> Club { get; set; }

    public DbContext CreateDbContext(string[] args)
    {
        throw new NotImplementedException();
    }
}