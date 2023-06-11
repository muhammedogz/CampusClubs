// using Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Server.Models;

namespace Server.Data;

public class ApplicationDbContext : DbContext
{
  public ApplicationDbContext()
  {

  }

  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

  public DbSet<User> Users { get; set; }
  public DbSet<Club> Clubs { get; set; }
  public DbSet<Event> Events { get; set; }
  public DbSet<Announcement> Announcements { get; set; }
  public DbSet<UserClub> UserClubs { get; set; }
  public DbSet<UserEvent> UserEvents { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<UserClub>()
        .HasKey(uc => new { uc.UserId, uc.ClubId });

    modelBuilder.Entity<UserEvent>()
        .HasKey(ue => new { ue.UserId, ue.EventId });
  }

  public DbContext CreateDbContext(string[] args)
  {
    throw new NotImplementedException();
  }
}