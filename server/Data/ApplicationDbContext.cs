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


    public DbSet<User> Users { get; set; } // create users table with 4 (category has 4) columns

    public DbContext CreateDbContext(string[] args)
    {
        throw new NotImplementedException();
    }
}