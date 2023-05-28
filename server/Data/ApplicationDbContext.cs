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
    public DbSet<User> Users { get; set; }
    
    public DbSet<Club> Club { get; set; }

    public DbSet<Event> Event { get; set; }

    public DbSet<Announcement> Announcement { get; set; }

    public DbSet<ClubMember> ClubMembers { get; set; }

    public DbSet<ClubAnnouncement> ClubAnnouncements { get; set; }
    
    public DbSet<ClubEvent> ClubEvents { get; set; }

    public DbContext CreateDbContext(string[] args)
    {
        throw new NotImplementedException();
    }
}