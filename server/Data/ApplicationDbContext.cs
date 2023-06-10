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

    // !!! Names should be same with the table names in the database
    public DbSet<User> User { get; set; }
    
    public DbSet<Club> Club { get; set; }

    public DbSet<Event> Event { get; set; }

    public DbSet<Announcement> Announcement { get; set; }

    public DbSet<ClubMember> ClubMembers { get; set; }

    public DbSet<ClubAnnouncement> ClubAnnouncements { get; set; }
    
    public DbSet<ClubEvent> ClubEvents { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // to auto increment the id
        modelBuilder.Entity<User>()
            .Property(u => u.userId)
            .ValueGeneratedOnAdd();
        // ...
    }

    public DbContext CreateDbContext(string[] args)
    {
        throw new NotImplementedException();
    }
}